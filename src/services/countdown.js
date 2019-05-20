import { task } from 'folktale/concurrency/task'

export function countdown (n, delay, onStep) {
  return task(resolver => {
    let count = 0

    let intervalId = setInterval(() => {
      count++
      onStep(n - count)

      if (count >= n) {
        resolver.resolve()
      }
    }, delay)

    resolver.cleanup(() => {
      clearTimeout(intervalId)
    })
  })
}
