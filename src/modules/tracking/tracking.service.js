const CustomerModel = require('../customer/customer.model')
const ServiceModel = require('../service/service.model')
const HistoryModel = require('../service_history/service_history.model')
const ServiceHelper = require('../service/service.helper')

exports.verify = async (code, contact) => {
  const service = await ServiceModel.findOne({
    where: { tracking_code: code },
    include: [{
      model: CustomerModel,
      as: 'customer'
    }]
  })

  const serviceData = service ? ServiceHelper.getServiceDetail(service) : null
  if (!serviceData) return null

  const isValid = serviceData.customer_email === contact || serviceData.customer_phone === contact
  
  return isValid ? service : null
}

exports.getDetail = async (code) => {
  const service = await ServiceModel.findOne({
    where: { tracking_code: code },
    include: [{
      model: CustomerModel,
      as: 'customer'
    }]
  })

  const history = await HistoryModel.findAll({
    where: { service_id: service.id },
    order: [['createdAt', 'DESC']]
  })

  return { service, history }
}