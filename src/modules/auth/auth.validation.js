const Validator = require('validatorjs')

exports.login = body => {
  const rules = {
    email: 'required|email',
    password: 'required'
  }

  const messages = {
    required: ':attribute is required',
    email: ':attribute invalid format'
  }

  return new Validator(
    body,
    rules,
    messages
  )
}