const Model = require('./service_history.model')
const AdminModel = require('../admin/admin.model')

Model.belongsTo(AdminModel, {
  foreignKey: 'updated_by',
  as: 'admin'
})

exports.store = async payload => {
  return await Model.create(payload)
}

exports.getByServiceId = async serviceId => {
  return await Model.findAll({
    where: { service_id: serviceId },
    order: [['createdAt', 'DESC']],
    include: [
      {
        model: AdminModel,
        as: 'admin',
        attributes: ['id', 'name']
      }
    ]
  })
}
