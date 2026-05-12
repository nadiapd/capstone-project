const Validation = require('./service.validation')
const Service = require('./service.service')
const HistoryService = require('../service_history/service_history.service')
const Render = require('../../helpers/render.helper')
const Helper = require('./service.helper')
const HistoryHelper = require('../service_history/service_history.helper')

exports.indexPage = async (req, res) => {
  try {
    const filters = req.query || {}
    
    const services = await Service.getAll(filters)
    
    const result = services ? Helper.getServices(services) : []
    
    return Render.view(res, 'pages/services/list', {
      title: 'Services',
      layout: 'main',
      services: result,
      query: filters
    })
  } catch {
    return Render.redirect(res, '/dashboard')
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
  } catch  {
    return Render.redirect(
      res,
      '/services'
    )
  }
}

exports.store = async (req, res) => {
  try {
    const validation = Validation.store(req.body)

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
  } catch {
    return Render.redirect(
      res,
      '/services/create'
    )
  }
}

exports.detailPage = async (req, res) => {
  try {
    const service = await Service.getById(req.params.id)

    const result = service ? Helper.getServiceDetail(service) : null

    return Render.view(
      res,
      'pages/services/detail',
      {
        title: 'Service Detail',
        layout: 'main',
        service: result
      }
    )
  } catch {
    return Render.redirect(
      res,
      '/services'
    )
  }
}

exports.updateStatus = async (req, res) => {
  try {
    await Service.updateStatus(
      req.params.id,
      req.body.status,
      req.body.note,
      req.admin?.name || 'System'
    )

    return Render.redirect(
      res,
      `/services/${req.params.id}`
    )
  } catch {
    return Render.redirect(
      res,
      '/services'
    )
  }
}

exports.progressPage = async (req, res) => {
  try {
    const service = await Service.getById(req.params.id)

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
  } catch {
    return Render.redirect(
      res,
      '/services'
    )
  }
}

exports.historyPage = async (req, res) => {
  try {
    const service = await Service.getById(req.params.id)

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

    const result = histories ? HistoryHelper.getHistories(histories) : []

    return Render.view(
      res,
      'pages/services/history',
      {
        title: 'Service History',
        layout: 'main',
        service,
        histories: result
      }
    )
  } catch {
    return Render.redirect(
      res,
      '/services'
    )
  }
}