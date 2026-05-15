const Helper = require('../service/service.helper')

const getHistories = (histories) => {
  const result = []

  Object.values(histories).forEach(
    (history, index) => {
      const obj = {}

      obj.status_label = Helper.formatStatus[history.status] || 'Unknown'
      obj.status_color = Helper.statusColors[history.status] || 'bg-slate-100 text-slate-600'
      obj.note = history.note || '-'
      obj.updated_by = history.updated_by === 0 || !history.admin ? 'System' : history.admin?.name || '-'
      obj.created_at = history.createdAt

      result[index] = obj
    }
  )

  return result
}

module.exports = {
  getHistories
}