const Model =
  require('../service/service.model')

const CustomerModel = require('../customer/customer.model')
const HistoryModel = require('../service_history/service_history.model')

exports.search = async (tracking_code, contact) => {

  const service = await Model.findOne({
    where: {
      tracking_code
    },
    include: [
      {
        model: CustomerModel,
        as: 'customer'
      },
      {
        model: HistoryModel,
        as: 'histories'
      }
    ]
  })

  if (!service) {
    return null
  }

  if (contact.email && service.customer?.email !== contact.email) {
    return null
  }

  if (contact.phone && service.customer?.phone !== contact.phone) {
    return null
  }

  return service
}