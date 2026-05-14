const Model = require('./service_history.model')

exports.store = async payload => {
  return await Model.create(payload)
}

exports.getByServiceId = async serviceId => {
  return await Model.findAll({
    where: { service_id: serviceId },
    order: [['createdAt', 'DESC']]
  })
}
