const config = require('../../config/db')

const Sequelize = config.Sequelize
const sequelize = config.sequelize

const ServiceHistory = sequelize.define('service_histories', {
  id: {
    type: Sequelize.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  service_id: {
    type: Sequelize.BIGINT,
    allowNull: false,
    references: {
      model: 'services',
      key: 'id'
    }
  },
  status: {
    type: Sequelize.STRING(50),
    allowNull: false
  },
  note: {
    type: Sequelize.TEXT
  },
  updated_by: {
    type: Sequelize.STRING(255)
  }
})

module.exports = ServiceHistory