const router = require('express').Router()
const GuestMiddleware = require('../../middlewares/guest.middleware')
const Controller = require('./auth.controller')

router.get('/login', GuestMiddleware, Controller.loginPage)
router.post('/login', GuestMiddleware, Controller.login)
router.get('/logout', Controller.logout)

module.exports = router