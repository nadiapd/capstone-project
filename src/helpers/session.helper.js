
exports.getFlash = (req, key) => {
  if (!req.session || !req.session[key]) return null

  const data = req.session[key]
  delete req.session[key]
  return data
}

exports.setFlash = (req, key, value) => {
  if (req.session) {
    req.session[key] = value
  }
}

exports.clearFlash = (req, key) => {
  if (req.session && req.session[key]) {
    delete req.session[key]
  }
}