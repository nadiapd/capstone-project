// const app = require('./app')
// const { sequelize, Category } = require('./models')

// const port = process.env.PORT || 3000

// const seedCategories = async () => {
//   const count = await Category.count()
//   if (count === 0) {
//     await Category.bulkCreate([
//       { category_name: 'Laptop' },
//       { category_name: 'Smartphone' },
//       { category_name: 'Printer' },
//       { category_name: 'Monitor' },
//       { category_name: 'Televisi' }
//     ])
//   }
// }

// const start = async () => {
//   try {
//     await sequelize.authenticate()
//     await sequelize.sync()
//     await seedCategories()

//     app.listen(port, () => {
//       // eslint-disable-next-line no-console
//       console.log(`Server berjalan di http://localhost:${port}`)
//     })
//   } catch (err) {
//     // eslint-disable-next-line no-console
//     console.error('Gagal memulai server:', err)
//     process.exit(1)
//   }
// }

// start()

