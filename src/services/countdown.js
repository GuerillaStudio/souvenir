import EventEmitter from 'eventemitter3'

export function countdown (n, delay) {
  return new Countdown(n, delay)
}

class Countdown extends EventEmitter {
  constructor (n, delay) {
    super()

    this._n = n
    this._delay = delay

    this._count = 0
    this._intervalId = null

    this._running = false
    this._started = false
    this._ended = false
    this._cancelled = false
    this._done = false
  }

  run () {
    if (!this._running && !this._started) {
      this._running = true
      this._started = true
      this.emit('started')
      this._update()

      this._intervalId = setInterval(() => {
        this._count++
        this._update()

        if (this._count >= this._n) {
          this._cleanup()
          this.done = true
          this.emit('done')
          this._end()
        }
      }, this._delay)
    }
  }

  cancel () {
    if (this._running && !this._ended) {
      this._cleanup()
      this._cancelled = true
      this.emit('cancelled')
      this._end()
    }
  }

  _update () {
    this.emit('progress', this._count / this._n)
    this.emit('update', this._n - this._count)
  }

  _end () {
    this.ended = true
    this.emit('ended')
    this._running = false
  }

  _cleanup () {
    clearInterval(this._intervalId)
  }
}
