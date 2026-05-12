exports.notFoundHandler = (req, res) => {
  res.status(404)
  return res.render('errors/404', {
    title: 'Halaman Tidak Ditemukan',
    url: req.originalUrl
  })
}

exports.errorHandler = (err, req, res) => {
  res.status(err.status || 500)
  return res.render('errors/500', {
    title: 'Terjadi Kesalahan',
    message: err.message || 'Internal server error'
  })
}
