import { convertImageDataToIndexedColorImage } from '~/src/services/quantize-color.js'

onmessage = event => {
  const { imageData, paletteSize } = event.data

  postMessage(convertImageDataToIndexedColorImage(imageData, paletteSize))
}
