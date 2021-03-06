import U = require('unionize')
const log = require('./lib/log')
const {unionize, ofType} = U

type PersonData = {
  name: string
}

const Person = unionize({
  NONE: {},
  CHILD: ofType<PersonData>(),
  ADULT: ofType<PersonData>(),
  CODER: ofType<PersonData>(),
})


const isCoder = Person.is.CODER(Rick)
log(isCoder)

Person.match(Rick, {
  CHILD: () => log('child'),
  CODER: name => log('coder: ', name),
  default: () => log('otherwise'),
})

const MatureRick = Person.transform(Rick, {
  CODER: data => Person.ADULT(data),
})
const isAdult = Person.is.ADULT(MatureRick)
log(isAdult)

class Maybe {
  static of(value) {
    return new Maybe(value)
  }
  constructor(value) {
    this.value = value
  }

  isNothing() {
    this.value
  }
  fold(render) {
    return this.isNothing() ? null : render(this.value)
  }
}
