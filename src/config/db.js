const Sequelize = require('sequelize')

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    operatorAliases: false,
    dialectOptions: {
      'connectTimeout': 30000
    },
    pool: {
      max: 100,
      min: 0,
      acquire: 1000000,
      idle: 200000
    },
    define: {
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
      timestamps: true
    },
    logging: false
  }
)

const db = {}
db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db