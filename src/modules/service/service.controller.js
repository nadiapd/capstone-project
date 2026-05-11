const Validation =
  require('./service.validation')

const Service =
  require('./service.service')

const Render =
  require('../../helpers/render.helper')

const Helper =
  require('./service.helper')

exports.indexPage = async (req, res) => {

  try {

    const services =
      await Service.getAll()

    const result =
      Helper.getServices(
        services
      )
console.log(services)
    return Render.view(
      res,
      'pages/services/list',
      {
        title: 'Services',
        layout: 'main',
        services: result
      }
    )

  } catch (err) {

    console.log(err)

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
      'pages/services/create',
      {
        title: 'Create Service',
        layout: 'main'
      }
    )

  } catch (err) {

    console.log(err)

    return Render.redirect(
      res,
      '/services'
    )
  }
}

exports.store = async (req, res) => {

  try {
 console.log(req.body)
    const validation =
      Validation.store(req.body)

    if (validation.fails()) {

      return Render.view(
        res,
        'pages/services/create',
        {
          title: 'Create Service',
          layout: 'main',
          errors: validation.errors.all(),
          old: req.body
        }
      )
    }

    await Service.store(req.body)

    return Render.redirect(
      res,
      '/services'
    )

  } catch (err) {

    console.log(err)

    return Render.redirect(
      res,
      '/services/create'
    )
  }
}

exports.detailPage = async (req, res) => {

  try {

    const service =
      await Service.getById(req.params.id)

    return Render.view(
      res,
      'pages/services/detail',
      {
        title: 'Service Detail',
        layout: 'main',
        service
      }
    )

  } catch (err) {

    console.log(err)

    return Render.redirect(
      res,
      '/services'
    )
  }
}

const HistoryService =
  require('../service_history/service_history.service')

exports.updateStatus = async (req, res) => {

  try {

    await Service.updateStatus(
      req.params.id,
      req.body.status,
      req.body.note,
      req.admin?.name || 'Admin'
    )

    return Render.redirect(
      res,
      `/services/${req.params.id}`
    )

  } catch (err) {

    console.log(err)

    return Render.redirect(
      res,
      '/services'
    )
  }
}

exports.progressPage = async (req, res) => {

  try {

    const service =
      await Service.getById(req.params.id)

    if (!service) {
      return Render.redirect(
        res,
        '/services'
      )
    }

    return Render.view(
      res,
      'pages/services/progress',
      {
        title: 'Update Service Progress',
        layout: 'main',
        service
      }
    )

  } catch (err) {

    console.log(err)

    return Render.redirect(
      res,
      '/services'
    )
  }
}

exports.historyPage = async (req, res) => {

  try {

    const service =
      await Service.getById(req.params.id)

    if (!service) {
      return Render.redirect(
        res,
        '/services'
      )
    }

    const histories =
      await HistoryService.getByServiceId(
        req.params.id
      )

    return Render.view(
      res,
      'pages/services/history',
      {
        title: 'Service History',
        layout: 'main',
        service,
        histories
      }
    )

  } catch (err) {

    console.log(err)

    return Render.redirect(
      res,
      '/services'
    )
  }
}