const { Op } = require('sequelize')

const AdminService = require('../admin/admin.service')
const AdminModel = require('../admin/admin.model')
const TokenModel = require('./token.model')
const crypto = require('crypto')

TokenModel.belongsTo(
  AdminModel,
  {
    foreignKey: 'admin_id',
    as: 'admin'
  }
)

exports.login = async payload => {
  const { email, password } = payload

  const admin = await AdminService.getByEmail(email)

  if (!admin) {
    return null
  }

  const isValidPassword = await AdminService.verifyPassword(password, admin.password)

  if (!isValidPassword) {
    return null
  }

  // Generate token
  const token = crypto.randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

  await TokenModel.create({
    admin_id: admin.id,
    token,
    expires_at: expiresAt
  })

  return {
    id: admin.id,
    name: admin.name,
    email: admin.email,
    token
  }
}

exports.verifyToken = async token => {
  const tokenRecord =
    await TokenModel.findOne({
      where: {
        token,
        expires_at: {
          [Op.gt]: new Date()
        }
      },
      include: [
        {
          model: AdminModel,
          as: 'admin'
        }
      ]
    })

  if (!tokenRecord) {
    return null
  }

  return {
    id: tokenRecord.admin.id,
    name: tokenRecord.admin.name,
    email: tokenRecord.admin.email
  }
}

exports.logout = async token => {
  await TokenModel.destroy({
    where: { token }
  })
  return true
}