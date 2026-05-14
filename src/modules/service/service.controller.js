const Validation = require('./service.validation')
const Service = require('./service.service')
const Customer = require('../customer/customer.service')
const CustomerHelper = require('../customer/customer.helper')
const HistoryService = require('../service_history/service_history.service')
const Render = require('../../helpers/render.helper')
const Helper = require('./service.helper')
const HistoryHelper = require('../service_history/service_history.helper')
const SessionHelper = require('../../helpers/session.helper')
const MailHelper = require('../../helpers/mail.helper')

exports.indexPage = async (req, res) => {
  try {
    const filters = req.query || {}
    
    const services = await Service.getAll(filters)
    
    const customers = await Customer.getAll({ 
      order: [['name', 'ASC']] 
    })
    
    const customerResult = customers ? CustomerHelper.getCustomers(customers) : []
    
    const result = services ? Helper.getServices(services) : []
    
    
    return Render.view(res, 'pages/services/list', {
      title: 'Services',
      layout: 'main',
      services: result,
      query: filters,
      customers: customerResult
    })
  } catch {
    return Render.redirect(res, '/dashboard')
  }
}

exports.store = async (req, res) => {
  try {
    const validation = Validation.store(req.body)

    if (validation.fails()) {
      const customers = await Customer.getAll({ 
        order: [['name', 'ASC']] 
      })
    
      const customerResult = customers ? CustomerHelper.getCustomers(customers) : []
      
      return Render.view(res, 'pages/services/list', {
        title: 'Services',
        layout: 'main',
        errors: validation.errors.all(),
        old: req.body,
        customers: customerResult
      })
    }

    await Service.store(req.body)

    return Render.redirect(res, '/services')
  } catch (err) {
    const customers = await Customer.getAll({ 
      order: [['name', 'ASC']] 
    })
    
    const customerResult = customers ? CustomerHelper.getCustomers(customers) : []

    return Render.view(res, 'pages/services/list', {
      title: 'Services',
      layout: 'main',
      errors: err,
      old: req.body,
      customers: customerResult
    })
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
        service: result,
        errors: SessionHelper.getFlash(req, 'errors'),
        old: SessionHelper.getFlash(req, 'old')
      }
    )
  } catch {
    return Render.redirect(
      res,
      '/services'
    )
  }
}

exports.update = async (req, res) => {
  try {
    const validation = Validation.update(req.body)

    if (validation.fails()) {
      SessionHelper.setFlash(req, 'errors', validation.errors.all())
      SessionHelper.setFlash(req, 'old', req.body)
  
      return Render.redirect(res, `/services/${req.params.id}`)
    }
    const service = await Service.getById(req.params.id)
    const serviceData = service ? Helper.getServiceDetail(service) : null

    if (!serviceData) {
      return res.status(404).send('Data servis tidak ditemukan')
    }

    const cleanTotalPrice = req.body.total_price && req.body.total_price !== '' ? req.body.total_price : null

    await Service.updateStatus(
      req.params.id,
      req.body.status,
      req.body.note,
      req.admin?.name || 'System',
      cleanTotalPrice
    )

    if (req.body.status === '3' || req.body.status === 3) {
      MailHelper.sendReadyNotification(serviceData.customer_email, {
        tracking_code: serviceData.tracking_code,
        customer_name: serviceData.customer_name,
        device_name: serviceData.device_name,
        total_cost: req.body.total_price
      }).then(() => {
        console.log(`✅ Email notifikasi terkirim ke: ${serviceData.customer_email}`)
        return Render.redirect(
          res,
          `/services/${req.params.id}`
        )
      }).catch(err => {
        return Render.view(
          res,
          'pages/services/detail',
          {
            title: 'Service Detail',
            layout: 'main',
            service: result,
            errors: SessionHelper.getFlash(req, 'errors'),
            old: SessionHelper.getFlash(req, 'old')
          }
        )
      })
    }
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

    const resultService = service ? Helper.getServiceDetail(service) : null

    const histories =
      await HistoryService.getByServiceId(
        req.params.id
      )

    const resultHistory = histories ? HistoryHelper.getHistories(histories) : []

    return Render.view(
      res,
      'pages/services/history',
      {
        title: 'Service History',
        layout: 'main',
        service: resultService,
        histories: resultHistory
      }
    )
  } catch {
    return Render.redirect(
      res,
      '/services'
    )
  }
}