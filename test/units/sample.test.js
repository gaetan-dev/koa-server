const sinon = require('sinon')

describe('Sample Test', () => {
  it('should pass', () => {
    const sum = 1 + 2
    expect(sum).toEqual(3)
  })
})

function greaterThanTwenty (num) {
  if (num > 20) return true
  return false
}

describe('Sample Sinon Stub', () => {
  it('should pass', (done) => {
    expect(greaterThanTwenty(0)).toBeFalsy()
    expect(greaterThanTwenty(30)).toBeTruthy()
    const greaterThanTwentyStub = sinon.stub().returns('something')
    expect(greaterThanTwentyStub(0)).toBe('something')
    expect(greaterThanTwentyStub(30)).toBe('something')
    done()
  })
})

class Person {
  constructor (givenName, familyName) {
    this.givenName = givenName
    this.familyName = familyName
  }

  get fullName () {
    return `${this.givenName} ${this.familyName}`
  }
}

describe('Sample Sinon Stub Take 2', () => {
  it('should pass', () => {
    const person = new Person('Michael', 'Jordan')
    expect(person.fullName).toBe('Michael Jordan')
    sinon.stub(Person.prototype, 'fullName').get(() => 'John Doe')
    expect(person.fullName).toBe('John Doe')
  })
})
