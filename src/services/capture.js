import EventEmitter from 'eventemitter3'
import pEvent from 'p-event'
import { makeRectangle, crop } from '/services/rectangle.js'

import {
  GIF_WIDTH,
  GIF_HEIGHT,
  GIF_FRAME_RATE
} from '/constants.js'

export function capture ({ mediaStream, facingMode }, duration) {
  const emitter = new EventEmitter()

  Promise.resolve().then(async () => {
    const delayTime = 1000 / GIF_FRAME_RATE
    const totalFrames = duration / 1000 * GIF_FRAME_RATE

    // Well, this is a very low frame rate or very short duration clip
    if (totalFrames < 1) {
      emitter.emit('done', {
        imageWidth: GIF_WIDTH,
        imageHeight: GIF_HEIGHT,
        imageDataList: [],
        delayTime
      })

      return
    }

    const imageDataList = []

    const canvas = document.createElement('canvas')
    canvas.width = GIF_WIDTH
    canvas.height = GIF_HEIGHT

    const destinationRectangle = makeRectangle(0, 0, canvas.width, canvas.height)

    const canvasContext = canvas.getContext('2d')

    if (facingMode === 'user' || facingMode === 'unknow') {
      canvasContext.translate(destinationRectangle.width, 0)
      canvasContext.scale(-1, 1)
    }

    const video = document.createElement('video')
    video.setAttribute('playsinline', '')
    video.setAttribute('webkit-playsinline', '')
    video.srcObject = mediaStream
    video.play()

    await pEvent(video, 'canplaythrough')
    const soureRectangle = crop(makeRectangle(0, 0, video.videoWidth, video.videoHeight))

    step()

    function step () {
      canvasContext.drawImage(
        video,
        soureRectangle.x,
        soureRectangle.y,
        soureRectangle.width,
        soureRectangle.height,
        destinationRectangle.x,
        destinationRectangle.y,
        destinationRectangle.width,
        destinationRectangle.height
      )

      const imageData = canvasContext.getImageData(
        destinationRectangle.x,
        destinationRectangle.y,
        destinationRectangle.width,
        destinationRectangle.height
      )

      imageDataList.push(imageData)

      emitter.emit('progress', imageDataList.length / totalFrames)

      if (imageDataList.length < totalFrames) {
        setTimeout(step, delayTime)
      } else {
        emitter.emit('done', {
          imageDataList,
          imageWidth: GIF_WIDTH,
          imageHeight: GIF_HEIGHT,
          delayTime
        })
      }
    }
  })
    .catch(error => emitter.emit('error', error))

  return emitter
}
