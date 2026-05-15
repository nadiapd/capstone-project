const config = require('../../config/db')

const Sequelize = config.Sequelize
const sequelize = config.sequelize

const Service = sequelize.define('services', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  tracking_code: {
    type: Sequelize.STRING(255),
    allowNull: false
  },
  customer_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'customers',
      key: 'id'
    }
  },
  device_category: {
    type: Sequelize.ENUM('laptop', 'smartphone', 'printer', 'monitor', 'televisi', 'lainnya'),
    allowNull: false
  },
  device_category_other: {
    type: Sequelize.STRING(255)
  },
  device_name: {
    type: Sequelize.STRING(255)
  },
  note: {
    type: Sequelize.TEXT
  },
  estimated_price: {
    type: Sequelize.DECIMAL(15, 2),
    defaultValue: 0
  },
  total_price: {
    type: Sequelize.DECIMAL(15, 2),
    defaultValue: 0
  },
  /**
   * Status Service:
   * 1 = Baru (Antrean masuk)
   * 2 = Proses (Sedang dikerjakan teknisi)
   * 3 = Siap Ambil (Selesai diperbaiki, menunggu pelanggan)
   * 4 = Selesai (Sudah diambil & dibayar)
   * 5 = Dibatalkan (Tidak jadi servis/tidak bisa diperbaiki)
   */
  status: {
    type: Sequelize.INTEGER,
    defaultValue: 1,
    comment: '1:Baru, 2:Proses, 3:Siap Ambil, 4:Selesai, 5:Dibatalkan'
  }
})

module.exports = Service