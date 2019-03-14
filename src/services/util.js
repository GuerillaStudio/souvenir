export function calcProgress (from, to, value) {
  return from + ((to - from) * value)
}

export function promisesProgress (promises, progress) {
  let complete = 0

  return promises.map(p => {
    return p.then(x => {
      progress(++complete / promises.length)
      return p
    })
  })
}
