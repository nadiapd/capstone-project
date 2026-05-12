const Validation = require('./auth.validation')
const Service = require('./auth.service')
const Render = require('../../helpers/render.helper')

exports.loginPage = async (req, res) => {
  return Render.view(
    res,
    'pages/auth/login',
    {
      title: 'Admin Login',
      layout: 'auth'
    }
  )
}

exports.login = async (req, res) => {
  try {
    const validation = Validation.login(req.body)

    if (validation.fails()) {
      return Render.view(
        res,
        'pages/auth/login',
        {
          title: 'Admin Login',
          layout: 'auth',
          errors: validation.errors.all(),
          old: req.body
        }
      )
    }

    const admin = await Service.login(req.body)

    if (!admin) {
      return Render.view(
        res,
        'pages/auth/login',
        {
          title: 'Admin Login',
          layout: 'auth',
          message: 'Invalid email or password'
        }
      )
    }

    // Set token in cookie or return in response
    res.cookie('token', admin.token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    })

    return Render.redirect(
      res,
      '/dashboard'
    )
  } catch {
    return Render.redirect(
      res,
      '/auth/login'
    )
  }
}

exports.logout = async (req, res) => {
  try {
    const token = req.cookies.token

    if (token) {
      await Service.logout(token)
    }

    res.clearCookie('token')

    return Render.redirect(
      res,
      '/auth/login'
    )
  } catch {
    return Render.redirect(
      res,
      '/auth/login'
    )
  }
}