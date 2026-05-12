const Validator = require('validatorjs')

exports.store = payload => {
  const rules = {
    name: 'required|string|max:255',
    email: 'required|email|max:255',
    password: 'required|string|min:6'
  }

  return new Validator(payload, rules)
}

exports.update = payload => {
  const rules = {
    name: 'required|string|max:255',
    email: 'required|email|max:255',
    password: 'string|min:6'
  }

  return new Validator(payload, rules)
}