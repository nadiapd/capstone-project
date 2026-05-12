const getCustomers = customers => {
  const result = []

  Object.values(customers).forEach((customer, index) => {
    const obj = {}

    obj.id = customer.id
    obj.name = customer.name
    obj.email = customer.email
    obj.phone = customer.phone
    obj.created_at = customer.createdAt

    result[index] = obj
  })

  return result
}

const getCustomer = customer => {
  if (!customer) {
    return null
  }

  return {
    id: customer.id,
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    created_at: customer.createdAt
  }
}

module.exports = {
  getCustomers,
  getCustomer
}