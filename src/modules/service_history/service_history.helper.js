const Helper = require('../service/service.helper')

const getHistories = (histories) => {
  if (!histories) return []

  return histories.map(h => ({
    status_label: Helper.formatStatus[h.status] || 'Unknown',
    status_color: Helper.statusColors[h.status] || 'bg-slate-100 text-slate-600',
    note: h.note,
    updated_by: h.updated_by,
    created_at: h.createdAt
  }))
}

module.exports = {
  getHistories
}