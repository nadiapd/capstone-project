const Validator = require('validatorjs')

exports.store = body => {
  const rules = {
    customer_name: 'required',
    customer_email: 'email',
    customer_phone: 'string',
    device_category: 'required|in:laptop,smartphone,printer,monitor,televisi,lainnya',
    device_category_other: 'string|max:255',
    device_name: 'required',
    note: 'required'
  }

  const messages = {
    required: ':attribute is required',
    email: ':attribute invalid format',
    in: ':attribute must be one of: laptop, smartphone, printer, monitor, televisi, lainnya'
  }

  return new Validator(
    body,
    rules,
    messages
  )
}