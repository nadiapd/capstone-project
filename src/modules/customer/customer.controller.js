const Validation = require('./customer.validation')
const Service = require('./customer.service')
const Render = require('../../helpers/render.helper')
const Helper = require('./customer.helper')

exports.indexPage = async (req, res) => {
  try {
    const customers = await Service.getAll()

    const result = Helper.getCustomers(customers)

    return Render.view(
      res,
      'pages/customers/list',
      {
        title: 'Customers',
        layout: 'main',
        customers: result
      }
    )
  } catch {
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
      'pages/customers/create',
      {
        title: 'Create Customer',
        layout: 'main'
      }
    )

  } catch {
    return Render.redirect(
      res,
      '/customers'
    )
  }
}

exports.store = async (req, res) => {
  try {
    const validation = Validation.store(req.body)

    if (validation.fails()) {
      return Render.view(
        res,
        'pages/customers/create',
        {
          title: 'Create Customer',
          layout: 'main',
          errors: validation.errors.all(),
          old: req.body
        }
      )
    }

    await Service.store(req.body)

    return Render.redirect(
      res,
      '/customers'
    )
  } catch {
    return Render.view(
      res,
      'pages/customers/create',
      {
        title: 'Create Customer',
        layout: 'main',
        errors: validation.errors.all(),
        old: req.body
      }
    )
  }
}

exports.editPage = async (req, res) => {
  try {
    const customer = await Service.getById(req.params.id)

    if (!customer) {
      return Render.redirect(
        res,
        '/customers'
      )
    }

    const result = Helper.getCustomer(customer)

    return Render.view(
      res,
      'pages/customers/edit',
      {
        title: 'Edit Customer',
        layout: 'main',
        customer: result
      }
    )

  } catch {
    return Render.redirect(
      res,
      '/customers'
    )
  }
}

exports.update = async (req, res) => {
  try {
    const validation = Validation.update(req.body)

    if (validation.fails()) {
      const customer = await Service.getById(req.params.id)

      return Render.view(
        res,
        'pages/customers/edit',
        {
          title: 'Edit Customer',
          layout: 'main',
          errors: validation.errors.all(),
          old: req.body,
          customer
        }
      )
    }

    await Service.update(req.params.id, req.body)

    return Render.redirect(
      res,
      '/customers'
    )
  } catch {
    const customer = await Service.getById(req.params.id)

    return Render.view(
      res,
      'pages/customers/edit',
      {
        title: 'Edit Customer',
        layout: 'main',
        errors: validation.errors.all(),
        old: req.body,
        customer
      }
    )
  }
}

exports.delete = async (req, res) => {
  try {
    await Service.delete(req.params.id)

    return Render.redirect(
      res,
      '/customers'
    )

  } catch {
    return Render.redirect(
      res,
      '/customers'
    )
  }
}