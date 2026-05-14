const express = require('express')
const router = express.Router()
const Controller = require('./customer.controller')

router.get('/', Controller.indexPage)
router.post('/store', Controller.store)
router.post('/:id/update', Controller.update)
// router.post('/:id/delete', Controller.delete)

module.exports = router