const { Op } = require('sequelize')

// const Response = require('../helpers/response.helper')
const AuthService = require('../modules/auth/auth.service')
const TokenModel = require('../modules/auth/token.model')

module.exports = async (req, res, next) => {
  try {
    // Get token from cookie
    const token = req.cookies.token

    if (!token) {
      return res.redirect('/auth/login')
    }

    // Delete expired token
    await TokenModel.destroy({
      where: {
        expires_at: {
          [Op.lte]: new Date()
        }
      }
    })

    // Verify token
    const admin = await AuthService.verifyToken(token)

    if (!admin) {
      res.clearCookie('token')
      return res.redirect('/auth/login')
    }

    // Inject admin session
    req.admin = admin

    next()
  } catch {
    return res.redirect('/auth/login')
  }
}