const express =require('express')
const emailController = require('../controllers/emailController')
const router = express.Router()

router.get('/success/:email',emailController.success)
router.get('/failed/:email',emailController.failed)
module.exports =router
