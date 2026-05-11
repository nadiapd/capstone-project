const router = require('express').Router()

const Controller = require('./service.controller')

router.get('/', Controller.indexPage)
router.get('/create', Controller.createPage)
router.post('/store', Controller.store)
router.get('/:id', Controller.detailPage)
router.get('/:id/progress', Controller.progressPage)
router.post('/:id/update', Controller.updateStatus)
router.get('/:id/history', Controller.historyPage)

module.exports = router