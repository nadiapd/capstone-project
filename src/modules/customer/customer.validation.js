const Validator = require('validatorjs')

exports.store = body => {
  const rules = {
    name: 'required|string|max:255',
    email: 'required|email|max:255',
    phone: 'required|numeric'
  }
  const messages = {
    required: ':attribute is required',
    email: ':attribute invalid format',
    numeric: ':attribute must be a number'
  }

  return new Validator(
    body,
    rules,
    messages
  )
}

exports.update = body => {
  const rules = {
    name: 'required|string|max:255',
    email: 'required|email|max:255',
    phone: 'required|numeric|max:1'
  }
  const messages = {
    required: ':attribute is required',
    email: ':attribute invalid format',
    numeric: ':attribute must be a number'
  }

  return new Validator(
    body,
    rules,
    messages
  )
}