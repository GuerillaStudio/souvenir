import EventEmitter from 'eventemitter3'
import genericPool from 'generic-pool'
import pEvent from 'p-event'
import { write } from '/services/encode-core.js'
import { promisesProgress, calcProgress } from '/services/util.js'

import { GIF_PALETTE_SIZE } from '/constants.js'

export function encode ({ imageDataList, imageWidth, imageHeight, delayTime }) {
  const emitter = new EventEmitter()

  const quantizeColorWorkerPool = genericPool.createPool({
    create: () => new Worker('/services/quantize-color.worker.js'),
    destroy: worker => worker.terminate()
  }, {
    min: 0,
    max: 2
  })


  const indexedColorImagesP = imageDataList
    .map(async imageData => {
      const worker = await quantizeColorWorkerPool.acquire()

      const indexedColorImage = await new Promise((resolve, reject) => {
        worker.onerror = reject
        worker.onmessageerror = reject
        worker.onmessage = event => {
          resolve(event.data)
        }

        worker.postMessage({
          imageData,
          paletteSize: GIF_PALETTE_SIZE
        })
      })

      await quantizeColorWorkerPool.release(worker)
      return indexedColorImage
    })

  const progressPromises = promisesProgress(indexedColorImagesP, function (value) {
    emitter.emit('progress', calcProgress(0, 0.9, value))
  })

  Promise.all(progressPromises).then(indexedColorImages => {
    const writeWorker = new Worker('/services/write-gif.worker.js')

    writeWorker.onerror = error => emitter.emit('error', error)
    writeWorker.onmessageerror = error => emitter.emit('error', error)

    writeWorker.onmessage = event => {
      const { type, payload } = event.data

      switch (type) {
        default:
          emitter.emit('error', new Error(`Unexpected worker message with type ${type}`))
          break

        case 'progress':
          emitter.emit('progress', calcProgress(0.9, 1, payload.value))
          break

        case 'done':
          const byteArray = new Uint8Array(payload.buffer)
          const blob = new Blob([byteArray], { type: 'image/gif' })
          const objectUrl = URL.createObjectURL(blob)
          emitter.emit('done', objectUrl)
          break
      }
    }

    writeWorker.postMessage({
      imageWidth,
      imageHeight,
      indexedColorImages,
      delayTime
    })
  })
  .catch(error => emitter.emit('error', error))

  return emitter
}
