const log = require('./lib/log')
const R = require('ramda')
const daggy = require('daggy')
const Obs = require('rxjs')
const ops = require('rxjs/operators')

// 1. how does daggy work
// 2  how can you extend the prototype

const User = daggy.taggedSum('User', {
  None: [],
  Loading: [],
  Regular: ['id', 'details'],
  Admin: ['id', 'details'],
  Evil: ['id', 'details'],
})

User.prototype.toRegular = function(id, details) {
  return this.cata({
    Loading: () => User.Regular(id, details),
  })
}

const user1 = User.Regular(1, {name: 'rick'})
const user2 = User.Regular(2, {name: 'rick'})

user1.cata({
  None: () => log('CATA SAYS: NONE'),
  Loading: () => log('CATA SAYS: LOADING'),
  Regular: (id, details) => log('CATA SAYS: USER', id, log(details)),
  Admin: (id, details) => log('CATA SAYS: USER', id, log(details)),
  Evil: (id, details) => log('CATA SAYS: USER', id, log(details)),
})
// log(user1.is(User.Regular))
// log(user1.toString())

class Maybe {
  static of(value) {
    return new Maybe(value)
  }
  constructor(value) {
    this.value = value
  }
  isNothing() {
    return this.value === undefined || this.value === null
  }
  map(fn) {
    const val = fn(this.value)
    return new Maybe(val)
  }
  fold(render) {
    return this.isNothing ? null : render(this.value)
  }
}

const nums = Obs.from([1, 2, 3, 4]).pipe(
  ops.flatMap(v => {
    if (v % 2 === 0) {
      return Obs.of(v).pipe(ops.delay(100))
    }
    return Obs.of(v)
  }),
)

const subscriber = {
  next: c => console.log(c),
  complete: () => console.log('done'),
  error: e => console.log(e),
}

const letters = Obs.from(['a', 'b', 'c', 'd'])

const logit = msg => ops.map(v => `${msg}: ${v}`)

Obs.merge(nums, letters)
  .pipe(logit('here'))
  .subscribe(subscriber)
