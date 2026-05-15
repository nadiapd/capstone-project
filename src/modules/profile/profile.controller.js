const Validation = require('./profile.validation')
const Profile = require('./profile.service')
const Render = require('../../helpers/render.helper')
const SessionHelper = require('../../helpers/session.helper')

exports.passwordPage = (req, res) => {
  return Render.view(res, 'pages/profile/password', {
    title: 'Ganti Password',
    layout: 'main',
    errors: SessionHelper.getFlash(req, 'errors'),
    success: SessionHelper.getFlash(req, 'success')
  })
}

exports.password = async (req, res) => {
  try {
    const adminId = req.admin.id

    const validation = Validation.password(req.body)

    if (validation.fails()) {
      SessionHelper.setFlash(req, 'errors', validation.errors.all())
      SessionHelper.setFlash(req, 'old', req.body)
      return Render.redirect(res, '/admins')
    }

    await Profile.updatePassword(adminId, 
      req.body.old_password, 
      req.body.new_password
    )

    SessionHelper.setFlash(req, 'success', 'Password berhasil diperbarui.')
    return Render.redirect(
      res,
      '/profile/change-password'
    )
  } catch (err) {
    const systemError = {
      system: [err.message]
    }
    SessionHelper.setFlash(req, 'errors', systemError)
    return Render.redirect(res, '/admins')
  }
}