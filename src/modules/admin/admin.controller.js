const Validation = require('./admin.validation')
const Admin = require('./admin.service')
const Render = require('../../helpers/render.helper')
const Helper = require('./admin.helper')
const SessionHelper = require('../../helpers/session.helper')
const MailHelper = require('../../helpers/mail.helper')

exports.indexPage = async (req, res) => {
  try {
    console.log(req.admin)
    const filters = req.query || {}

    const admins = await Admin.getAll(filters)

    const result = Helper.getAdmins(admins)

    return Render.view(
      res,
      'pages/admins/index',
      {
        title: 'Customers',
        layout: 'main',
        admins: result,
        query: filters,
        errors: SessionHelper.getFlash(req, 'errors'),
        old: SessionHelper.getFlash(req, 'old'),
        success: SessionHelper.getFlash(req, 'success')
      }
    )
  } catch (err) {
    const systemError = {
      system: [err.message]
    }
    SessionHelper.setFlash(req, 'errors', systemError)
    return Render.redirect(
      res,
      '/dashboard'
    )
  }
}

exports.store = async (req, res) => {
  try {
    const rawPassword = Math.random().toString(36).slice(-8)
    const body = {...req.body}
    const validation = Validation.store(req.body)

    if (validation.fails()) {
      SessionHelper.setFlash(req, 'errors', validation.errors.all())
      SessionHelper.setFlash(req, 'old', req.body)
      return Render.redirect(res, '/admins')
    }

    body.password = rawPassword

    await Admin.store(body)

    await MailHelper.sendAdminWelcomeEmail(body.email, {
      name: body.name,
      email: body.email,
      password: rawPassword,
      login_url: `${process.env.APP_URL}/auth/login`
    }).catch(err => console.error('Gagal kirim email admin:', err.message))
    
    SessionHelper.setFlash(req, 'success', 'Admin berhasil dibuat & password dikirim ke email.')
    return Render.redirect(
      res,
      '/admins'
    )
  } catch (err) {
    const systemError = {
      system: [err.message]
    }
    SessionHelper.setFlash(req, 'errors', systemError)
    return Render.redirect(res, '/admins')
  }
}

exports.update = async (req, res) => {
  try {
    console.log(req.body)
    const validation = Validation.update(req.body)

    if (validation.fails()) {
      SessionHelper.setFlash(req, 'errors', validation.errors.all())
      SessionHelper.setFlash(req, 'old', req.body)
      return Render.redirect(res, '/admins')
    }

    await Admin.update(req.params.id, req.body)

    SessionHelper.setFlash(req, 'success', 'Admin berhasil diedit.')
    return Render.redirect(
      res,
      '/admins'
    )
  } catch (err) {
    const systemError = {
      system: [err.message]
    }
    SessionHelper.setFlash(req, 'errors', systemError)
    return Render.redirect(res, '/admins')
  }
}

exports.delete = async (req, res) => {
  try {
    await Admin.delete(req.params.id)

    SessionHelper.setFlash(req, 'success', 'Admin berhasil dihapus.')
    return Render.redirect(
      res,
      '/admins'
    )
  } catch (err) {
    const systemError = {
      system: [err.message]
    }
    SessionHelper.setFlash(req, 'errors', systemError)
    return Render.redirect(res, '/admins')
  }
}