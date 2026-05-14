const Model = require('./customer.model')

exports.getAll = async (filters) => {
  let whereCondition = {}
  if (filters.q && filters.q !== '') {
    whereCondition[Op.or] = [
      { name: { [Op.like]: `%${filters.q}%` } }
    ]
  }
  
  let orderClause = [['createdAt', 'DESC']]

  const allowedSortFields = ['name', 'createdAt', 'updatedAt']

  if (filters.sortBy && allowedSortFields.includes(filters.sortBy)) {
    const direction = filters.sortOrder === 'ASC' ? 'ASC' : 'DESC'
    orderClause = [[filters.sortBy, direction]]
  }

  return await Model.findAll({
    where: whereCondition,
    order: orderClause
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