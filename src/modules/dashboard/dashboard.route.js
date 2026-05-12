const router = require('express').Router()
const Controller = require('./dashboard.controller')

router.get('/', Controller.indexPage)

module.exports = router