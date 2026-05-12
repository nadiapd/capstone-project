const express = require('express')
const router = express.Router()
const Controller = require('./customer.controller')

router.get('/', Controller.indexPage)
router.get('/create', Controller.createPage)
router.post('/', Controller.store)
router.get('/:id/edit', Controller.editPage)
router.post('/:id/update', Controller.update)
router.post('/:id/delete', Controller.delete)

module.exports = router