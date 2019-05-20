import { calcProgress } from '/services/util.js'
import { task, do as taskDo, waitAll } from 'folktale/concurrency/task'

import { GIF_PALETTE_SIZE } from '/constants.js'

export function encode ({ imageDataList, imageWidth, imageHeight, delayTime }, { boomerangEffect }, progressCallback) {
  return taskDo(function * () {
    const indexedColorImageList = yield quantizeColorImageDataList(
      imageDataList,
      GIF_PALETTE_SIZE,
      (value) => progressCallback(calcProgress(0, 0.9, value))
    )

    return writeBlob(
      imageWidth,
      imageHeight,
      indexedColorImageList,
      delayTime,
      boomerangEffect,
      (value) => progressCallback(calcProgress(0.9, 1, value))
    )
  })
}

function quantizeColorImageDataList (imageDataList, paletteSize, progressCallback) {
  let complete = 0

  const tasks = imageDataList
    .map(imageData => quantizeColorImageData(imageData, paletteSize))
    .map(task => {
      return task.map(x => {
        progressCallback(++complete / imageDataList.length)
        return x
      })
    })

  return waitAll(tasks)
}

function quantizeColorImageData (imageData, paletteSize) {
  return task((resolver) => {
    const worker = new Worker('/services/quantize-color.worker.js')

    resolver.cleanup(() => {
      worker.terminate()
    })

    worker.onerror = resolver.reject
    worker.onmessageerror = resolver.reject

    worker.onmessage = event => {
      resolver.resolve(event.data)
    }

    worker.postMessage({
      imageData,
      paletteSize
    })
  })
}

function writeBlob (
  imageWidth,
  imageHeight,
  indexedColorImages,
  delayTime,
  boomerangEffect,
  onProgress
) {
  return task((resolver) => {
    const worker = new Worker('/services/write-gif.worker.js')

    resolver.cleanup(() => {
      worker.terminate()
    })

    worker.onerror = resolver.reject
    worker.onmessageerror = resolver.reject

    worker.onmessage = event => {
      const { type, payload } = event.data

      switch (type) {
        case 'progress':
          onProgress(payload.value)
          return

        case 'done':
          resolver.resolve({
            blob: new Blob([new Uint8Array(payload.buffer)], { type: 'image/gif' }),
            createdAt: new Date()
          })
          return

        default:
          resolver.reject(new Error(`Unexpected worker message with type ${type}`))
      }
    }

    worker.postMessage({
      imageWidth,
      imageHeight,
      indexedColorImages,
      delayTime,
      boomerangEffect
    })
  })
}
