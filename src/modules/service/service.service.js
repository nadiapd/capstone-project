const { Op } = require('sequelize')

const Model = require('./service.model')
const CustomerModel = require('../customer/customer.model')
const HistoryModel = require('../service_history/service_history.model')
const HistoryService = require('../service_history/service_history.service')
const TrackingHelper = require('../../helpers/tracking.helper')

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

exports.getAll = async (filters = {}) => {
  let whereCondition = {}

  if (filters.category && filters.category !== '') {
    whereCondition.device_category = filters.category
  }

  if (filters.status && filters.status !== '') {
    whereCondition.status = parseInt(filters.status)
  }

  if (filters.q && filters.q !== '') {
    whereCondition[Op.or] = [
      { tracking_code: { [Op.like]: `%${filters.q}%` } },
      { device_brand: { [Op.like]: `%${filters.q}%` } },
      { '$customer.name$': { [Op.like]: `%${filters.q}%` } }
    ]
  }

  let orderClause = [['createdAt', 'DESC']]

  const allowedSortFields = ['tracking_code', 'status', 'createdAt', 'updatedAt']

  if (filters.sortBy && allowedSortFields.includes(filters.sortBy)) {
    const direction = filters.sortOrder === 'ASC' ? 'ASC' : 'DESC'
    orderClause = [[filters.sortBy, direction]]
  }

  return await Model.findAll({
    where: whereCondition,
    include: [
      {
        model: CustomerModel,
        as: 'customer',
        required: false
      }
    ],
    order: orderClause
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
  payload.status = 1

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

  const service = await Model.findByPk(id)

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