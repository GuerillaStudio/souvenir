export function makeRectangle (x, y, width, height) {
  return {
    x,
    y,
    width,
    height
  }
}

export function crop ({ x, y, width: w, height: h }) {
  if (w < h) {
    return makeRectangle((h - w) / 2, y, h, h)
  } else if (w > h) {
    return makeRectangle((w - h) / 2, y, h, h)
  } else {
    return makeRectangle(x, y, w, h)
  }
}
