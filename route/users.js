const express =require('express')
const userController = require('../controllers/usersController')
const router = express.Router()

router.route('/users')
    .post(userController.create)
router.post('/login',userController.login)
router.get('/users',userController.get)
router.put('/users',userController.completeReg)
module.exports =router
