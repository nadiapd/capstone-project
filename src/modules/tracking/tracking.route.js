const express = require('express')
const router = express.Router()
const trackingController = require('./tracking.controller')

router.get('/', trackingController.indexPage)
router.get('/track', trackingController.index)
router.post('/track', trackingController.track)
router.get('/track/:id', trackingController.detail)

module.exports = router