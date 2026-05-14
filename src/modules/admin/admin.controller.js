const Validation = require('./admin.validation')
const Admin = require('./admin.service')
const Render = require('../../helpers/render.helper')
const Helper = require('./admin.helper')
const SessionHelper = require('../../helpers/session.helper')

exports.indexPage = async (req, res) => {
  try {
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

exports.createPage = async (req, res) => {
  try {
    return Render.view(
      res,
      'pages/admins/create',
      {
        title: 'Create Admin',
        layout: 'main'
      }
    )

  } catch {
    return Render.redirect(
      res,
      '/admins'
    )
  }
}

exports.store = async (req, res) => {
  try {
    const validation = Validation.store(req.body)

    if (validation.fails()) {
      return Render.view(
        res,
        'pages/admins/create',
        {
          title: 'Create Admin',
          layout: 'main',
          errors: validation.errors.all(),
          old: req.body
        }
      )
    }

    await Service.store(req.body)

    return Render.redirect(
      res,
      '/admins'
    )

  } catch {
    return Render.view(
      res,
      'pages/admins/create',
      {
        title: 'Create Admin',
        layout: 'main',
        errors: validation.errors.all(),
        old: req.body
      }
    )
  }
}

exports.editPage = async (req, res) => {
  try {
    const admin = await Service.getById(req.params.id)

    if (!admin) {
      return Render.redirect(
        res,
        '/admins'
      )
    }

    return Render.view(
      res,
      'pages/admins/edit',
      {
        title: 'Edit Admin',
        layout: 'main',
        admin
      }
    )

  } catch {
    return Render.redirect(
      res,
      '/admins'
    )
  }
}

exports.update = async (req, res) => {
  try {
    const validation = Validation.update(req.body)

    if (validation.fails()) {
      const admin = await Service.getById(req.params.id)

      return Render.view(
        res,
        'pages/admins/edit',
        {
          title: 'Edit Admin',
          layout: 'main',
          errors: validation.errors.all(),
          old: req.body,
          admin
        }
      )
    }

    await Service.update(req.params.id, req.body)

    return Render.redirect(
      res,
      '/admins'
    )

  } catch {
    const admin = await Service.getById(req.params.id)

    return Render.view(
      res,
      'pages/admins/edit',
      {
        title: 'Edit Admin',
        layout: 'main',
        errors: validation.errors.all(),
        old: req.body,
        admin
      }
    )
  }
}

exports.delete = async (req, res) => {
  try {
    await Service.delete(req.params.id)

    return Render.redirect(
      res,
      '/admins'
    )

  } catch {
    return Render.redirect(
      res,
      '/admins'
    )
  }
}