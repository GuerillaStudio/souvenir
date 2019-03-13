import { GifWriter } from 'gif-writer'
import pLimit from 'p-limit'

onmessage = handleMessage

async function handleMessage (event) {
  const { imageDataList, imageWidth, imageHeight, paletteSize, delayTime } = event.data

  const outputStream = new OutputStream()
  const writer = new GifWriter(outputStream)

  postProgressMessage(0)

  writer.writeHeader()

  writer.writeLogicalScreenInfo({
    width: imageWidth,
    height: imageHeight
  })

  writer.writeLoopControlInfo(0)

  console.time('quantization')

  const limit = pLimit(8)

  const promises = imageDataList
    .map(imageData => limit(() => convertImageDataToIndexedColorImage(imageData, paletteSize)))

  const progressPromises = promisesProgress(promises, function (value) {
    postProgressMessage(calcProgress(0, 0.9, value))
  })

  const indexedColorImages = await Promise.all(progressPromises)

  console.timeEnd('quantization')

  indexedColorImages.forEach((indexedColorImage, index, { length }) => {
    writer.writeTableBasedImageWithGraphicControl(indexedColorImage, { delayTimeInMS: delayTime })
    postProgressMessage(calcProgress(0.9, 1, (index + 1) / length))
  })

  writer.writeTrailer()

  postDoneMessage(outputStream.buffer)
}

class OutputStream {
  constructor () {
    this.buffer = []
  }

  writeByte (b) {
    this.buffer.push(b)
  }

  writeBytes (bb) {
    Array.prototype.push.apply(this.buffer, bb)
  }
}

function promisesProgress (promises, progress) {
  let complete = 0

  return promises.map(p => {
    return p.then(x => {
      progress(++complete / promises.length)
      return p
    })
  })
}

function convertImageDataToIndexedColorImage (imageData, paletteSize) {
  return new Promise((resolve, reject) => {
    const worker = new Worker('/services/quantize-color.worker.js')

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
}

function calcProgress (from, to, value) {
  return from + ((to - from) * value)
}


function calcProgress2 (from, to, steps, current) {
  return from + ((to - from) / steps * current)
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
