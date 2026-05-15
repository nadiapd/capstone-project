const TrackingService = require('./tracking.service')
const SessionHelper = require('../../helpers/session.helper')
const ServiceHelper = require('../service/service.helper')
const HistoryHelper = require('../service_history/service_history.helper')
const Render = require('../../helpers/render.helper')

exports.indexPage = async (req, res) => {
  return Render.view(res, 'pages/landing', {
    layout: 'public',
    title: 'TechService',
    errors: SessionHelper.getFlash(req, 'errors'),
    old: SessionHelper.getFlash(req, 'old') || {}
  })
}

exports.index = async (req, res) => {
  return Render.view(res, 'pages/tracking/index', {
    layout: 'public',
    title: 'Lacak Servis',
    errors: SessionHelper.getFlash(req, 'errors'),
    old: SessionHelper.getFlash(req, 'old') || {}
  })
}

exports.track = async (req, res) => {
  const { tracking_code, contact_verification } = req.body

  try {
    const service = await TrackingService.verify(tracking_code, contact_verification)

    if (!service) {
      SessionHelper.setFlash(req, 'errors', { 
        auth: ['Kombinasi ID dan Kontak tidak valid.'] 
      })
      SessionHelper.setFlash(req, 'old', req.body)
      return Render.redirect(res, '/track')
    }

    SessionHelper.setFlash(req, 'tracking_access_token', service.tracking_code)

    return Render.redirect(res, `/track/${service.tracking_code}`)
  } catch (err) {
    const systemError = {
      system: [err.message]
    }
    SessionHelper.setFlash(req, 'errors', systemError)
    return Render.redirect(res, '/track')
  }
}

exports.detail = async (req, res) => {
  const { id } = req.params

  const accessToken = SessionHelper.getFlash(req, 'tracking_access_token')

  if (!accessToken || accessToken !== id) {
    SessionHelper.setFlash(req, 'errors', { 
      auth: ['Sesi berakhir. Silakan masukkan data kembali.'] 
    })
    return Render.redirect(res, '/track')
  }

  try {
    const data = await TrackingService.getDetail(id)
    const resultService = data.service ? ServiceHelper.getServiceDetail(data.service) : null
    const resultHistory = data.history ? HistoryHelper.getHistories(data.history) : []
    
    return Render.view(res, 'pages/tracking/detail', {
      layout: 'public',
      title: `Detail Servis #${id}`,
      service: resultService,
      history: resultHistory
    })
  } catch  (err) {
    const systemError = {
      system: [err.message]
    }
    SessionHelper.setFlash(req, 'errors', systemError)
    return Render.redirect(res, '/track')
  }
}