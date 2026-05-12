module.exports = async (req, res, next) => {
  try {
    const token = req.cookies?.token

    // Belum login
    if (!token) {
      return next()
    }
    
    // Sudah login, redirect ke dashboard
    return res.redirect('/dashboard')
  } catch {
    return next()
  }
}