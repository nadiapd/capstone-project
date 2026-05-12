const Validator = require('validatorjs')

exports.store = payload => {
  const rules = {
    name: 'required|string|max:255',
    email: 'email|max:255',
    phone: 'string|max:50'
  }

  return new Validator(payload, rules)
}

exports.update = payload => {
  const rules = {
    name: 'required|string|max:255',
    email: 'email|max:255',
    phone: 'string|max:50'
  }

  return new Validator(payload, rules)
}