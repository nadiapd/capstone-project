const { Op } = require('sequelize')

const Model =
  require('./service.model')

const CustomerModel = require('../customer/customer.model')
const HistoryModel = require('../service_history/service_history.model')
const HistoryService = require('../service_history/service_history.service')

const TrackingHelper =
  require('../../helpers/tracking.helper')

Model.belongsTo(
  CustomerModel,
  {
    foreignKey: 'customer_id',
    as: 'customer'
  }
)

Model.hasMany(
  HistoryModel,
  {
    foreignKey: 'service_id',
    as: 'histories'
  }
)

HistoryModel.belongsTo(
  Model,
  {
    foreignKey: 'service_id',
    as: 'service'
  }
)

exports.getAll = async () => {

  return await Model.findAll({
    include: [{
      model: CustomerModel,
      as: 'customer'
    }],
    order: [['id', 'DESC']]
  })
}

exports.getById = async id => {

  return await Model.findByPk(id, {
    include: [
      {
        model: CustomerModel,
        as: 'customer'
      },
      {
        model: HistoryModel,
        as: 'histories'
      }
    ],
    order: [
      [{ model: HistoryModel, as: 'histories' }, 'createdAt', 'ASC']
    ]
  })
}

exports.store = async payload => {

  // Create or find customer
  let customer = null

  if (payload.customer_email || payload.customer_phone) {
    customer = await CustomerModel.findOne({
      where: {
        [Op.or]: [
          payload.customer_email
            ? { email: payload.customer_email }
            : null,
          payload.customer_phone
            ? { phone: payload.customer_phone }
            : null
        ].filter(Boolean)
      }
    })
  }

  if (!customer && payload.customer_name) {
    customer = await CustomerModel.findOne({
      where: {
        name: payload.customer_name
      }
    })
  }

  if (!customer) {
    customer = await CustomerModel.create({
      name: payload.customer_name,
      email: payload.customer_email,
      phone: payload.customer_phone
    })
  }

  payload.customer_id = customer.id
  payload.tracking_code = TrackingHelper.generateTrackingCode()
  payload.status = 'pending'

  // Remove customer fields from payload
  delete payload.customer_name
  delete payload.customer_email
  delete payload.customer_phone

  return await Model.create(payload)
}

exports.updateStatus = async (
  id,
  status,
  note,
  updatedBy
) => {

  const service =
    await Model.findByPk(id)

  if (!service) {
    throw new Error('Service not found')
  }

  service.status = status

  await service.save()

  await HistoryService.store({
    service_id: id,
    status,
    note,
    updated_by: updatedBy || 'Admin'
  })

  return service
}