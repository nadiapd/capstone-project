const formatStatus = {
  1: 'Baru',
  2: 'Proses',
  3: 'Siap Ambil',
  4: 'Selesai',
  5: 'Batal'
}

const statusColors = {
  1: 'bg-slate-100 text-slate-600',
  2: 'bg-blue-100 text-blue-700',
  3: 'bg-yellow-100 text-yellow-700',
  4: 'bg-green-100 text-green-700',
  5: 'bg-red-100 text-red-700'
}

const getServices = services => {
  const result = []

  Object.values(services).forEach(
    (service, index) => {
      const obj = {}

      obj.id = service.id
      obj.tracking_code = service.tracking_code
      
      obj.customer_name = service.customer?.name || service.customer_name
      obj.customer_email = service.customer?.email || service.customer_email
      obj.customer_phone = service.customer?.phone || service.customer_phone

      obj.device_category = service.device_category
      obj.device_category_other = service.device_category_other
      obj.device_name = service.device_name
      obj.device_brand = service.device_brand
      obj.note = service.note

      obj.status = service.status
      obj.status_label = formatStatus[service.status] || 'Unknown'
      obj.status_color = statusColors[service.status] || 'bg-slate-100 text-slate-600'

      obj.created_at = service.createdAt
      obj.updated_at = service.updatedAt

      result[index] = obj
    }
  )

  return result
}

const getServiceDetail = service => {
  if (!service) return null

  return {
    id: service.id,
    tracking_code: service.tracking_code,
    customer_id: service.customer_id,
    customer_name: service.customer?.name || service.customer_name,
    customer_email: service.customer?.email || service.customer_email,
    customer_phone: service.customer?.phone || service.customer_phone,
    device_name: service.device_name,
    device_brand: service.device_brand,
    device_category: service.device_category_other ? 'Lainnya/' + service.device_category_other : service.device_category,
    note: service.note,
    estimated_price: service.estimated_price,
    total_price: service.total_price,
    status: service.status,
    status_label: formatStatus[service.status] || 'Unknown',
    status_color: statusColors[service.status] || 'bg-slate-100 text-slate-600',
    created_at: service.createdAt,
    updated_at: service.updatedAt
  }
}

module.exports = {
  formatStatus,
  statusColors,
  getServices,
  getServiceDetail,
  formatStatus
}