import genericPool from 'generic-pool'
import pEvent from 'p-event'
import { write } from '/services/encode-core.js'
import { promisesProgress, calcProgress } from '/services/util.js'

onmessage = handleMessage

const workerPool = genericPool.createPool({
  create () {
    return new Worker('/services/quantize-color.worker.js')
  },
  destroy (worker) {
    worker.terminate()
  }
}, {
  min: 0,
  max: 4
})

async function handleMessage (event) {
  const { imageDataList, imageWidth, imageHeight, paletteSize, delayTime } = event.data

  postProgressMessage(0)

  console.time('quantization')

  const promises = imageDataList
    .map(async imageData => {
      const worker = await workerPool.acquire()

      const indexedColorImage = await new Promise((resolve, reject) => {
        worker.onerror = reject
        worker.onmessageerror = reject
        worker.onmessage = event => {
          resolve(event.data)
        }

        worker.postMessage({
          imageData,
          paletteSize
        })
      })

      await workerPool.release(worker)
      return indexedColorImage
    })

  const progressPromises = promisesProgress(promises, function (value) {
    postProgressMessage(calcProgress(0, 0.9, value))
  })

  const indexedColorImages = await Promise.all(progressPromises)

  console.timeEnd('quantization')

  console.time('write')

  const writing = write(indexedColorImages, imageWidth, imageHeight, delayTime)

  writing.on('progress', value => postProgressMessage(calcProgress(0.9, 1, value)))

  const buffer = await pEvent(writing, 'done')

  console.timeEnd('write')

  postDoneMessage(buffer)
}

function postProgressMessage (value) {
  postMessage({
    type: 'progress',
    payload: {
      value
    }
  })
}

function postDoneMessage (buffer) {
  postMessage({
    type: 'done',
    payload: {
      buffer
    }
  })
}
