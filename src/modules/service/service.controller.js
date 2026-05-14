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
    
    return Render.view(res, 'pages/services/index', {
      title: 'Services',
      layout: 'main',
      services: result,
      query: filters,
      customers: customerResult,
      errors: SessionHelper.getFlash(req, 'errors'),
      old: SessionHelper.getFlash(req, 'old'),
      success: SessionHelper.getFlash(req, 'success')
    })
  } catch (err) {
    const systemError = {
      system: [err.message]
    }
    SessionHelper.setFlash(req, 'errors', systemError)
    return Render.redirect(res, '/dashboard')
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
      return Render.redirect(res, '/services')
    }

    const newService = await Service.store(req.body)

    const serviceDetail = await Service.getById(newService.id)
    const formattedService = Helper.getServiceDetail(serviceDetail)

    // 3. Kirim Email Nota Digital (Async/Background)
    MailHelper.sendNewServiceNotification(formattedService.customer_email, {
      tracking_code: formattedService.tracking_code,
      customer_name: formattedService.customer_name,
      device_name: formattedService.device_name,
      estimated_price: req.body.estimated_price || 0,
      note: req.body.note || '-'
    }).catch(err => console.error('Gagal kirim email nota:', err.message))

    SessionHelper.setFlash(req, 'success', 'Sukses menambah data servis baru.')
    return Render.redirect(res, '/services')
  } catch (err) {
    const systemError = {
      system: [err.message]
    }
    SessionHelper.setFlash(req, 'errors', systemError)
    return Render.redirect(res, '/services')
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
  } catch (err) {
    const systemError = {
      system: [err.message]
    }
    SessionHelper.setFlash(req, 'errors', systemError)
    return Render.redirect(
      res,
      '/services'
    )
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
    
    SessionHelper.setFlash(req, 'success', 'Sukses menambah progress.')

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
  } catch (err) {
    const systemError = {
      system: [err.message]
    }
    SessionHelper.setFlash(req, 'errors', systemError)
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
  } catch (err) {
    const systemError = {
      system: [err.message]
    }
    SessionHelper.setFlash(req, 'errors', systemError)
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
  } catch (err) {
    const systemError = {
      system: [err.message]
    }
    SessionHelper.setFlash(req, 'errors', systemError)
    return Render.redirect(
      res,
      '/services'
    )
  }
}