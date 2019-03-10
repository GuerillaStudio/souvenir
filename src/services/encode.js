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
          const byteArray = new Uint8Array(payload.buffer)
          const blob = new Blob([byteArray], { type: 'image/gif' })
          const objectUrl = URL.createObjectURL(blob)
          resolve(objectUrl)
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
