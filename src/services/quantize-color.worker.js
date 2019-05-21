import { convertImageDataToIndexedColorImage } from '/services/quantize-color.js'

onmessage = event => {
  const { imageData, paletteSize } = event.data

  postMessage(convertImageDataToIndexedColorImage(imageData, paletteSize))
}
