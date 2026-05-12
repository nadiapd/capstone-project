const express = require('express')
const authMiddleware = require('../middlewares/auth.middleware')
const ServiceController = require('../modules/service/service.controller')

const router = express.Router()

router.use(authMiddleware.validateHeader)

router.get('/services', ServiceController.apiList)
router.post('/services', ServiceController.apiCreate)
router.get('/services/:id', ServiceController.apiDetail)
router.put('/services/:id/status', ServiceController.apiUpdateStatus)
router.get('/tracking/:code', ServiceController.apiTrack)

module.exports = router