import { GifWriter } from 'gif-writer'
import { boomerang } from '/services/effects.js'
import { pipe, calcProgress } from '/services/util.js'

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

export function write (imageWidth, imageHeight, delay, indexedColorImages, boomerangEffect, progressCallback) {
  const outputStream = new OutputStream()
  const writer = new GifWriter(outputStream)

  progressCallback(0)
  writer.writeHeader()

  writer.writeLogicalScreenInfo({
    width: imageWidth,
    height: imageHeight
  })

  writer.writeLoopControlInfo(0)

  const frames = pipe(indexedColorImages, [
    (images) => boomerangEffect ? boomerang(images) : images
  ])

  frames.forEach((indexedColorImage, index, { length }) => {
    writer.writeTableBasedImageWithGraphicControl(indexedColorImage, { delayTimeInMS: delay })
    progressCallback(calcProgress(0, 0.99, (index + 1) / length))
  })

  writer.writeTrailer()
  progressCallback(1)

  return outputStream.buffer
}
