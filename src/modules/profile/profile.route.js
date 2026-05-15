const express = require('express')
const router = express.Router()

const Controller = require('./profile.controller')

router.get('/change-password', Controller.passwordPage)
router.post('/change-password', Controller.password)

module.exports = router