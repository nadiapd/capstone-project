const Validator = require('validatorjs')

exports.store = body => {
  const rules = {
    customer_id: 'required',
    customer_name: 'string',
    customer_email: 'required|email',
    customer_phone: 'required|numeric',
    device_category: 'required|in:laptop,smartphone,printer,monitor,televisi,lainnya',
    device_category_other: 'string|max:255',
    device_name: 'required',
    note: 'required',
    estimated_price: 'required|numeric'
  }

  const messages = {
    required: ':attribute is required',
    email: ':attribute invalid format',
    numeric: ':attribute must be a number',
    in: ':attribute must be one of: laptop, smartphone, printer, monitor, televisi, lainnya'
  }

  return new Validator(
    body,
    rules,
    messages
  )
}

exports.update = body => {
  const rules = {
    status: 'required|in:1,2,3,4,5',
    note: 'required|min:5',
    total_price: 'string'
  }

  if (body.status === '3') {
    rules.total_price = 'required'
  }

  const messages = {
    required: ':attribute wajib diisi.',
    in: 'Status yang dipilih tidak valid.',
    min: ':attribute minimal :min karakter.'
  }

  return new Validator(
    body,
    rules,
    messages
  )
}