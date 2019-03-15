import {
  GIF_WIDTH,
  GIF_HEIGHT,
  GIF_FRAME_RATE
} from '/constants.js'

import {
  makeRectangle,
  crop
} from '/services/rectangle.js'

export function capture (commit, mediaStream, duration) {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    video.autoplay = true
    video.setAttribute('playsinline', '')
    video.setAttribute('webkit-playsinline', '')

    const canvas = document.createElement('canvas')
    canvas.width = GIF_WIDTH
    canvas.height = GIF_HEIGHT

    const canvasContext = canvas.getContext('2d')

    const totalFrames = duration / 1000 * GIF_FRAME_RATE

    if (totalFrames < 1) {
      resolve([])
    }

    const delayTime = 1000 / GIF_FRAME_RATE

    video.srcObject = mediaStream

    video.addEventListener('canplay', () => {
      const soureRectangle = crop(makeRectangle(0, 0, video.videoWidth, video.videoHeight))
      const destinationRectangle = makeRectangle(0, 0, canvas.width, canvas.height)

      const imageDataList = []

      const intervalId = setInterval(() => {
        if (imageDataList.length < totalFrames) {
          console.log(`Capturing frame ${imageDataList.length + 1} / ${totalFrames}`)

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

          commit('updateCaptureState', imageDataList.length / totalFrames * 100)
        } else {
          clearInterval(intervalId)

          resolve({
            imageDataList,
            imageWidth: GIF_WIDTH,
            imageHeight: GIF_HEIGHT,
            delayTime
          })
        }
      }, delayTime)
    })
  })
}
