import EventEmitter from 'eventemitter3'

import {
  GifWriter,
  MedianCutColorReducer,
  IndexedColorImage
} from 'gif-writer'

import { calcProgress } from '/services/util.js'

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

export function write (imageWidth, imageHeight, delay, indexedColorImages) {
  const emitter = new EventEmitter()

  // yup, this is the browser nextTick implementation we are waiting for :facepalm:
  Promise.resolve().then(() => {
    emitter.emit('progress', 0)

    const outputStream = new OutputStream()
    const writer = new GifWriter(outputStream)

    writer.writeHeader()

    writer.writeLogicalScreenInfo({
      width: imageWidth,
      height: imageHeight
    })

    writer.writeLoopControlInfo(0)

    indexedColorImages.forEach((indexedColorImage, index, { length }) => {
      writer.writeTableBasedImageWithGraphicControl(indexedColorImage, { delayTimeInMS: delay })
      emitter.emit('progress', calcProgress(0, 0.99, (index + 1) / length))
    })

    writer.writeTrailer()
    emitter.emit('progress', 1)

    emitter.emit('done', outputStream.buffer)
  })

  return emitter
}

export function convertImageDataToIndexedColorImage (imageData, paletteSize) {
  const reducer = new MedianCutColorReducer(imageData, paletteSize)

  const paletteData = reducer.process()

  const data = Array.from(imageData.data)
  const indexedColorImageData = []

  for (let index = 0, length = data.length; index < length; index += 4) {
    const [r, g, b] = data.slice(index, index + 4) // r,g,b,a
    indexedColorImageData.push(reducer.map(r, g, b))
  }

  return new IndexedColorImage(
    {
      width: imageData.width,
      height: imageData.height
    },
    indexedColorImageData,
    paletteData
  )
}
