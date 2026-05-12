const Model = require('./customer.model')

exports.getAll = async () => {
  return await Model.findAll({
    order: [['id', 'DESC']]
  })
}

exports.getById = async id => {
  return await Model.findByPk(id)
}

exports.store = async payload => {
  return await Model.create(payload)
}

exports.update = async (id, payload) => {
  const customer = await Model.findByPk(id)

  if (!customer) {
    throw new Error('Customer not found')
  }

  await customer.update(payload)

  return customer
}

exports.delete = async id => {
  const customer = await Model.findByPk(id)

  if (!customer) {
    throw new Error('Customer not found')
  }

  await customer.destroy()

  return true
}