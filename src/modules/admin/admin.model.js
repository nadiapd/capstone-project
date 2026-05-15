const config = require('../../config/db')

const Sequelize = config.Sequelize
const sequelize = config.sequelize

const Admin = sequelize.define('admins', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING(255),
    allowNull: false
  },
  email: {
    type: Sequelize.STRING(255),
    allowNull: false,
    unique: true
  },
  password: {
    type: Sequelize.STRING(255),
    allowNull: false
  }
})

module.exports = Admin