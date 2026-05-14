/**
 * Session Helper
 * Digunakan untuk mengelola data sementara (flash data) manual menggunakan req.session
 */

// Menghapus dan mengambil data dari session (Read & Delete)
exports.getFlash = (req, key) => {
  if (!req.session || !req.session[key]) return null

  const data = req.session[key]
  delete req.session[key] // Hapus setelah dibaca
  return data
}

// Menyimpan data ke session (Create)
exports.setFlash = (req, key, value) => {
  if (req.session) {
    req.session[key] = value
  }
}

// Menghapus data spesifik tanpa membacanya (Delete)
exports.clearFlash = (req, key) => {
  if (req.session && req.session[key]) {
    delete req.session[key]
  }
}