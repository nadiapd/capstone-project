const DashboardService = require('./dashboard.service')
const Render = require('../../helpers/render.helper')

exports.indexPage = async (req, res) => {
  try {
    const analytics = await DashboardService.analytics()

    return Render.view(
      res,
      'pages/dashboard',
      {
        title: 'Dashboard',
        layout: 'main',
        adminName: req.admin.name,
        ...analytics
      }
    )
  } catch {
    return Render.redirect(
      res,
      '/'
    )
  }
}