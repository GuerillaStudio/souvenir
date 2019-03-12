import {
  makeRectangle,
  crop
} from '/services/rectangle.js'

const FRAMES_PER_SECOND = 10
const WIDTH = 200
const HEIGHT = WIDTH

export function capture (commit, mediaStream, duration) {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    video.autoplay = true
    video.muted = true
    video.setAttribute('playsinline', '')
    video.setAttribute('webkit-playsinline', '')

    const canvas = document.createElement('canvas')
    canvas.width = WIDTH
    canvas.height = HEIGHT

    const canvasContext = canvas.getContext('2d')

    const totalFrames = duration / 1000 * FRAMES_PER_SECOND

    if (totalFrames < 1) {
      resolve([])
    }

    const delayTime = 1000 / FRAMES_PER_SECOND

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
            imageWidth: WIDTH,
            imageHeight: HEIGHT,
            delayTime
          })
        }
      }, delayTime)
    })
  })
}
