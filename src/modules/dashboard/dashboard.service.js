const ServiceModel = require('../service/service.model')
const { Op, fn, col, literal } = require('sequelize')

exports.analytics = async () => {
  const countByStatus = async (statusId) => await ServiceModel.count({ where: { status: statusId } })

  const baru = await countByStatus(1)
  const proses = await countByStatus(2)
  const siapAmbil = await countByStatus(3)
  const selesai = await countByStatus(4)
  const omzet = await ServiceModel.sum('total_price', { where: { status: 4 } }) || 0

  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)
  sevenDaysAgo.setHours(0, 0, 0, 0)

  const revenueHistory = await ServiceModel.findAll({
    attributes: [
      [fn('DATE', col('createdAt')), 'date'],
      [fn('SUM', col('total_price')), 'total']
    ],
    where: {
      status: 4,
      createdAt: { [Op.gte]: sevenDaysAgo }
    },
    group: [fn('DATE', col('createdAt'))],
    order: [[fn('DATE', col('createdAt')), 'ASC']],
    raw: true
  })

  const labels = []
  const totals = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().split('T')[0]
    
    labels.push(d.toLocaleDateString('id-ID', { weekday: 'short' }))
    
    const found = revenueHistory.find(h => h.date === dateStr)
    totals.push(found ? parseFloat(found.total) : 0)
  }

  return {
    baru,
    proses,
    siapAmbil,
    selesai,
    omzet,
    chartData: {
      labels,
      totals
    }
  }
}