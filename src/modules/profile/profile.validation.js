const Validator = require('validatorjs')

exports.password = payload => {
  const rules = {
    old_password: 'required',
    new_password: 'required|string|max:255'
  }

  return new Validator(payload, rules)
}