const config = require('../../config/db')

const Sequelize = config.Sequelize
const sequelize = config.sequelize

const Token = sequelize.define('tokens', {
  id: {
    type: Sequelize.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  admin_id: {
    type: Sequelize.BIGINT,
    allowNull: false,
    references: {
      model: 'admins',
      key: 'id'
    }
  },
  token: {
    type: Sequelize.STRING(255),
    allowNull: false,
    unique: true
  },
  expires_at: {
    type: Sequelize.DATE,
    allowNull: false
  }
})

module.exports = Token