import genericPool from 'generic-pool'
import { calcProgress } from '/services/util.js'
import {
  task,
  do as taskDo,
  of as taskOf,
  fromPromised as taskFromPromised,
  waitAll
} from 'folktale/concurrency/task'

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
  return task((resolver) => {
    const workerPool = genericPool.createPool({
      create: () => new Worker('/services/quantize-color.worker.js'),
      destroy: worker => worker.terminate()
    }, {
      min: 0,
      max: 2
    })

    resolver.cleanup(() => {
      workerPool.drain()
    })

    let complete = 0

    const acquireWorker = taskFromPromised(() => workerPool.acquire())
    const releaseWorker = taskFromPromised((worker) => workerPool.release(worker))

    const tasks = imageDataList
      .map(imageData => taskDo(function * () {
        const worker = yield acquireWorker()
        const indexedColorImage = yield quantizeColorImageData(worker, imageData, paletteSize)
        releaseWorker(worker).run()
        return taskOf(indexedColorImage)
      }))
      .map(task => {
        return task.map(x => {
          progressCallback(++complete / imageDataList.length)
          return x
        })
      })

    const execution = waitAll(tasks).run()

    resolver.onCancelled(() => { execution.cancel() })

    execution.listen({
      onCancelled: resolver.cancel,
      onRejected: resolver.reject,
      onResolved: resolver.resolve
    })
  })
}

function quantizeColorImageData (worker, imageData, paletteSize) {
  return task((resolver) => {
    resolver.cleanup(() => {
      worker.onerror = null
      worker.onmessageerror = null
      worker.onmessage = null
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
