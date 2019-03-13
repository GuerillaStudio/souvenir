import { MedianCutColorReducer, IndexedColorImage } from 'gif-writer'

onmessage = handleMessage

function handleMessage (event) {
  const { imageData, paletteSize } = event.data

  const indexedColorImage = convertImageDataToIndexedColorImage(imageData, paletteSize)

  postMessage(indexedColorImage)
}

function convertImageDataToIndexedColorImage (imageData, paletteSize) {
  const reducer = new MedianCutColorReducer(imageData, paletteSize)

  const paletteData = reducer.process()

  const data = Array.from(imageData.data)
  const indexedColorImageData = []

  for (let index = 0, length = data.length; index < length; index += 4) {
    const [r, g, b, a] = data.slice(index, index + 4) // r,g,b,a
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