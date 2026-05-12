exports.view = (res, page, data = {}) => {
  return res.render(
    page,
    data
  )
}

exports.redirect = (res, url) => {
  return res.redirect(url)
}