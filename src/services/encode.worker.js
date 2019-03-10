import {
  GifWriter,
  MedianCutColorReducer,
  IndexedColorImage
} from 'gif-writer'

onmessage = (event) => {
  console.log(event.data)
  const { imageDataList, imageWidth, imageHeight, paletteSize, delayTime } = event.data

  console.log('Write GIF')

  const outputStream = new OutputStream()
  const writer = new GifWriter(outputStream)

  postProgressMessage(0)

  console.log(`Write header`)
  writer.writeHeader()

  console.log(`Write logical screen informations`)
  writer.writeLogicalScreenInfo({
    width: imageWidth,
    height: imageHeight
  })

  writer.writeLoopControlInfo(0)

  const indexedColorImages = imageDataList.map((imageData, index, { length }) => {
    console.log(`Convert frame ${index} ImageData to IndexedColorImage`)
    const indexedColorImage = imageDataToIndexedColorImage(imageData, paletteSize)
    postProgressMessage(calcProgress(0, 0.9, length, index + 1))
    return indexedColorImage
  })

  indexedColorImages.forEach((indexedColorImage, index, { length }) => {
    console.log(`Write frame IndexedColorImage ${index}`)
    writer.writeTableBasedImageWithGraphicControl(indexedColorImage, { delayTimeInMS: delayTime })
    postProgressMessage(calcProgress(0.9, 1, length, index + 1))
  })

  console.log(`Write trailer`)
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

function imageDataToIndexedColorImage (imageData, paletteSize) {
  var reducer = new MedianCutColorReducer(imageData, paletteSize)
  var paletteData = reducer.process()
  var dat = Array.prototype.slice.call(imageData.data)

  var indexedColorImageData = []

  for (var idx = 0, len = dat.length; idx < len; idx += 4) {
    var d = dat.slice(idx, idx + 4) // r,g,b,a
    indexedColorImageData.push(reducer.map(d[0], d[1], d[2]))
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

function calcProgress (from, to, steps, current) {
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
