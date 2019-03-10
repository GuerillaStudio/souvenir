import EncodeWorker from '@/services/encode.worker.js'

const PALETTE_SIZE = 255

export function encode ({ imageDataList, imageWidth, imageHeight, delayTime }) {
  return new Promise((resolve, reject) => {
    const worker = new EncodeWorker()

    worker.onerror = error => reject(error)

    worker.onmessage = event => {
      const { type, payload } = event.data

      switch (type) {
        default:
          reject(new Error(`Unexpected EncodeWorker message with type ${type}`))
          break

        case 'progress':
          console.log(`Encoding progress : ${payload.value}`)
          break

        case 'done':
          const base64Content = btoa(payload.buffer.map((b) => String.fromCharCode(b)).join(''))
          const dataUrl = 'data:image/gif;base64,' + base64Content
          resolve(dataUrl)
          break
      }
    }

    worker.postMessage({
      imageDataList,
      imageWidth,
      imageHeight,
      paletteSize: PALETTE_SIZE,
      delayTime
    })
  })
}
