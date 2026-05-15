const getAdmins = admins => {
  const result = []

  Object.values(admins).forEach((admin, index) => {
    const obj = {}

    obj.id = admin.id
    obj.name = admin.name
    obj.email = admin.email
    obj.created_at = admin.createdAt

    result[index] = obj
  })

  return result
}

const getAdmin = admin => {
  if (!admin) {
    return null
  }

  return {
    id: admin.id,
    name: admin.name,
    email: admin.email,
    created_at: admin.createdAt
  }
}

module.exports = {
  getAdmins,
  getAdmin
}