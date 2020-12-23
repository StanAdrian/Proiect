const jwt = require('jsonwebtoken')
const { secret } = require('../config').jwt

class JwtService {
  constructor() {}

  sign(payload) {
    return jwt.sign(payload, secret)
  }

  verify(token) {
    try {
      return jwt.verify(token, secret)
    } catch (error) {
      return false
    }
  }

  decode(token) {
    return jwt.decode(token, { complete: true })
  }
}

module.exports = new JwtService()
