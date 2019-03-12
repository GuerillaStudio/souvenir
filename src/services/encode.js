import EventEmitter from 'eventemitter3'

const PALETTE_SIZE = 255

export function encode ({ imageDataList, imageWidth, imageHeight, delayTime }) {
  const emitter = new EventEmitter()
  const worker = new Worker('/services/encode.worker.js')

  worker.onerror = error => emitter.emit('error', error)
  worker.onmessageerror = error => emitter.emit('error', error)

  worker.onmessage = event => {
    const { type, payload } = event.data

    switch (type) {
      default:
        emitter.emit('error', new Error(`Unexpected worker message with type ${type}`))
        break

      case 'progress':
        emitter.emit('progress', payload.value)
        break

      case 'done':
        const byteArray = new Uint8Array(payload.buffer)
        const blob = new Blob([byteArray], { type: 'image/gif' })
        const objectUrl = URL.createObjectURL(blob)
        emitter.emit('done', objectUrl)
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

  return emitter
}
