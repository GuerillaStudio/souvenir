import { task, of as taskOf } from 'folktale/concurrency/task'
import { makeRectangle, crop } from '/services/rectangle.js'

import {
  GIF_WIDTH,
  GIF_HEIGHT,
  GIF_FRAME_RATE
} from '/constants.js'

export function capture ({ mediaStream, facingMode }, duration, progressCallback) {
  const delayTime = 1000 / GIF_FRAME_RATE
  const totalFrames = duration / 1000 * GIF_FRAME_RATE

  if (totalFrames < 1) {
    return taskOf({
      imageWidth: GIF_WIDTH,
      imageHeight: GIF_HEIGHT,
      imageDataList: [],
      delayTime
    })
  }

  return task(resolver => {
    const video = document.createElement('video')
    video.setAttribute('playsinline', '')
    video.setAttribute('webkit-playsinline', '')
    video.srcObject = mediaStream
    video.play()

    video.addEventListener('canplaythrough', afterVideoAvailable, {
      once: true
    })

    resolver.cleanup(() => {
      video.removeEventListener('canplaythrough', afterVideoAvailable)
    })

    function afterVideoAvailable () {
      const canvas = document.createElement('canvas')
      canvas.width = GIF_WIDTH
      canvas.height = GIF_HEIGHT

      const canvasContext = canvas.getContext('2d')

      if (facingMode === 'user' || facingMode === 'unknow') {
        canvasContext.translate(canvas.width, 0)
        canvasContext.scale(-1, 1)
      }

      const imageDataList = []
      const destinationRectangle = makeRectangle(0, 0, canvas.width, canvas.height)
      const soureRectangle = crop(makeRectangle(0, 0, video.videoWidth, video.videoHeight))

      captureFrame()

      const intervalId = setInterval(captureFrame, delayTime)

      resolver.cleanup(() => {
        clearInterval(intervalId)
      })

      function captureFrame () {
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

        progressCallback(imageDataList.length / totalFrames)

        if (imageDataList.length >= totalFrames) {
          resolver.resolve({
            imageDataList,
            imageWidth: GIF_WIDTH,
            imageHeight: GIF_HEIGHT,
            delayTime
          })
        }
      }
    }
  })
}
