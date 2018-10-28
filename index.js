const log = require('./lib/log')
const R = require('ramda')
const daggy = require('daggy')

// 1. how does daggy work
// 2 how can you extend the prototype

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
const user2 = User.None
// const user2 = User.Regular(2, {name: 'rick'})

// user.Regular(1, {name: 'dude'})

user1.cata({
  None: () => log('CATA SAYS: NONE'),
  Loading: () => log('CATA SAYS: LOADING'),
  Regular: (id, details) => log('CATA SAYS: USER', id, log(details)),
  Admin: (id, details) => log('CATA SAYS: USER', id, log(details)),
  Evil: (id, details) => log('CATA SAYS: USER', id, log(details)),
})
// log(user1.is(User.Regular))
log(user1.toString())
