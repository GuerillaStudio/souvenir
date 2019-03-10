import {
  makeRectangle,
  crop
} from './rectangle.js'

const FRAMES_PER_SECOND = 10
const WIDTH = 200
const HEIGHT = WIDTH

const video = document.createElement('video')

const canvas = document.createElement('canvas')
const canvasContext = canvas.getContext('2d')

canvas.width = WIDTH
canvas.height = HEIGHT

export function capture (commit, mediaStream, duration) {
  return new Promise((resolve, reject) => {
    const totalFrames = duration / 1000 * FRAMES_PER_SECOND

    if (totalFrames < 1) {
      resolve([])
    }

    const delayTime = 1000 / FRAMES_PER_SECOND

    video.srcObject = mediaStream

    const soureRectangle = crop(makeRectangle(0, 0, video.videoWidth, video.videoHeight))
    const destinationRectangle = makeRectangle(0, 0, canvas.width, canvas.height)

    const imageDataList = []

    const intervalId = setInterval(() => {
      if (imageDataList.length < totalFrames) {
        console.log(`Capturing frame ${imageDataList.length} / ${totalFrames}`)

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
}
