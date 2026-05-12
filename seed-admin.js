require('dotenv').config()

const db = require('./src/config/db')
const Admin = require('./src/modules/auth/auth.model')
const AdminService = require('./src/modules/admin/admin.service')

const seedAdmin = async () => {
  try {
    // Sync database
    await db.sequelize.sync()

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({
      where: { email: 'admin@gmail.com' }
    })

    if (existingAdmin) {
      process.exit(0)
    }

    await AdminService.store({
      name: 'Administrator',
      email: 'admin@gmail.com',
      password: 'admin123'
    })
    process.exit(0)
  } catch {
    process.exit(1)
  }
}

seedAdmin()
