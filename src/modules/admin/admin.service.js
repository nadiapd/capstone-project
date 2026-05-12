const Model = require('../admin/admin.model')
const bcrypt = require('bcrypt')

exports.getAll = async () => {
  return await Model.findAll({
    order: [['id', 'DESC']]
  })
}

exports.getById = async id => {
  return await Model.findByPk(id)
}

exports.getByEmail = async email => {
  return await Model.findOne({
    where: { email }
  })
}

exports.store = async payload => {
  payload.password = await bcrypt.hash(payload.password, 10)

  return await Model.create(payload)
}

exports.update = async (id, payload) => {
  const admin =
    await Model.findByPk(id)

  if (!admin) {
    throw new Error('Admin not found')
  }

  if (payload.password) {
    payload.password = await bcrypt.hash(payload.password, 10)
  }

  await admin.update(payload)

  return admin
}

exports.delete = async id => {
  const admin =
    await Model.findByPk(id)

  if (!admin) {
    throw new Error('Admin not found')
  }

  await admin.destroy()

  return true
}

exports.verifyPassword = async (password, hash) => {
  return await bcrypt.compare(password, hash)
}