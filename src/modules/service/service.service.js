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

exports.store = async (payload, admin) => {
  let customer = null
  const { customer_id, customer_name, customer_email, customer_phone } = payload

  if (customer_id && !isNaN(customer_id)) {
    customer = await CustomerModel.findByPk(customer_id)
  }

  if (!customer && (customer_email || customer_phone)) {
    customer = await CustomerModel.findOne({
      where: {
        [Op.or]: [
          ...(customer_email ? [{ email: customer_email }] : []),
          ...(customer_phone ? [{ phone: customer_phone }] : [])
        ]
      }
    })
  }

  if (!customer) {
    customer = await CustomerModel.create({
      name: customer_name || customer_id,
      email: customer_email,
      phone: customer_phone
    })
  }

  payload.customer_id = customer.id
  payload.tracking_code = TrackingHelper.generateTrackingCode()
  payload.status = 1 // Status: Baru

  const cleanPayload = { ...payload }
  delete cleanPayload.customer_name
  delete cleanPayload.customer_email
  delete cleanPayload.customer_phone

  const newService = await Model.create(cleanPayload)

  await HistoryModel.create({
    service_id: newService.id,
    status: 1,
    note: payload.note || 'Unit masuk pertama kali (Pendaftaran)',
    updated_by: admin.id
  })

  return newService
}

exports.updateStatus = async (
  id,
  status,
  note,
  updatedBy,
  totalPrice
) => {

  const service = await Model.findByPk(id)

  if (!service) {
    throw new Error('Service not found')
  }

  service.status = status

  if (totalPrice && totalPrice !== undefined) {
    service.total_price = totalPrice
  }

  await service.save()

  await HistoryService.store({
    service_id: id,
    status,
    note,
    updated_by: updatedBy || 0
  })

  return service
}