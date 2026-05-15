const Model = require('../admin/admin.model')
const bcrypt = require('bcrypt')

exports.updatePassword = async (adminId, oldPassword, newPassword) => {
  const admin = await Model.findByPk(adminId)
  
  if (!admin) throw new Error('Admin tidak ditemukan.')

  const isMatch = await bcrypt.compare(oldPassword, admin.password)
  if (!isMatch) throw new Error('Password lama yang Anda masukkan salah.')

  const hashedPassword = await bcrypt.hash(newPassword, 10)
  
  return await admin.update({ password: hashedPassword })
}