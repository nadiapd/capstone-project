const config = require('../../config/db')

const Sequelize = config.Sequelize
const sequelize = config.sequelize

const Customer = sequelize.define('customers', {
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
    type: Sequelize.STRING(255)
  },
  phone: {
    type: Sequelize.STRING(50)
  }
})

module.exports = Customer