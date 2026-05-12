const TrackingService = require('./tracking.service')
const Render = require('../../helpers/render.helper')

exports.indexPage = async (req, res) => {
  return Render.view(
    res,
    'pages/tracking/search',
    {
      title: 'Tracking Service',
      layout: 'public'
    }
  )
}

exports.search = async (req, res) => {
  try {
    const tracking_code = req.query.tracking_code
    const email = req.query.email
    const phone = req.query.phone

    if (!tracking_code || (!email && !phone)) {
      return Render.view(
        res,
        'pages/tracking/search',
        {
          title: 'Tracking Service',
          layout: 'public',
          error: 'Tracking code dan email atau nomor HP wajib diisi.',
          old: {
            tracking_code,
            email,
            phone
          }
        }
      )
    }

    const service = await TrackingService.search(
      tracking_code,
      { email, phone }
    )

    if (!service) {
      return Render.view(
        res,
        'pages/tracking/search',
        {
          title: 'Tracking Service',
          layout: 'public',
          error: 'Tracking code tidak ditemukan atau data kontak tidak sesuai.',
          old: {
            tracking_code,
            email,
            phone
          }
        }
      )
    }

    return Render.view(
      res,
      'pages/tracking/detail',
      {
        title: 'Tracking Detail',
        layout: 'public',
        service
      }
    )
  } catch {
    return Render.view(
      res,
      'pages/tracking/search',
      {
        title: 'Tracking Service',
        layout: 'public',
        error: 'Terjadi kesalahan saat mencari tracking.',
        old: {
          tracking_code: req.query.tracking_code,
          email: req.query.email,
          phone: req.query.phone
        }
      }
    )
  }
}