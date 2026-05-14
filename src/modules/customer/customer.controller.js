const Validation = require('./customer.validation')
const Customer = require('./customer.service')
const Render = require('../../helpers/render.helper')
const Helper = require('./customer.helper')
const SessionHelper = require('../../helpers/session.helper')

exports.indexPage = async (req, res) => {
  try {
    const filters = req.query || {}

    const customers = await Customer.getAll(filters)

    const result = Helper.getCustomers(customers)

    return Render.view(
      res,
      'pages/customers/index',
      {
        title: 'Customers',
        layout: 'main',
        customers: result,
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
  SessionHelper.clearFlash(req, 'success')
  SessionHelper.clearFlash(req, 'errors')
  SessionHelper.clearFlash(req, 'old')
  try {
    const validation = Validation.store(req.body)

    if (validation.fails()) {
      SessionHelper.setFlash(req, 'errors', validation.errors.all())
      SessionHelper.setFlash(req, 'old', req.body)
      return Render.redirect(res, '/customers')
    }

    await Customer.store(req.body)
    
    SessionHelper.setFlash(req, 'success', `Sukses menambah data ${req.body.name}.`)
    return Render.redirect(
      res,
      '/customers'
    )
  } catch (err) {
    const systemError = {
      system: [err.message]
    }
    SessionHelper.setFlash(req, 'errors', systemError)
    return Render.redirect(res, '/customers')
  }
}

exports.update = async (req, res) => {
  SessionHelper.clearFlash(req, 'success')
  SessionHelper.clearFlash(req, 'errors')
  SessionHelper.clearFlash(req, 'old')

  try {
    const validation = Validation.update(req.body)

    if (validation.fails()) {
      SessionHelper.setFlash(req, 'errors', validation.errors.all())
      SessionHelper.setFlash(req, 'old', req.body)
      return Render.redirect(res, '/customers')
    }

    await Customer.update(req.params.id, req.body)

    SessionHelper.setFlash(req, 'success', `Sukses mengedit data ${req.body.name}.`)
    return Render.redirect(
      res,
      '/customers'
    )
  } catch (err) {
    const systemError = {
      system: [err.message]
    }
    SessionHelper.setFlash(req, 'errors', systemError)
    return Render.redirect(res, '/customers')
  }
}

// exports.delete = async (req, res) => {
//   try {
//     await Service.delete(req.params.id)

//     return Render.redirect(
//       res,
//       '/customers'
//     )

//   } catch {
//     return Render.redirect(
//       res,
//       '/customers'
//     )
//   }
// }