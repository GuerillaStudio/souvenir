import { convertImageDataToIndexedColorImage } from '/services/encode-core.js'

onmessage = handleMessage

function handleMessage (event) {
  const { imageData, paletteSize } = event.data

  const indexedColorImage = convertImageDataToIndexedColorImage(imageData, paletteSize)

  postMessage(indexedColorImage)
}
