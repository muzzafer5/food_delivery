const express = require('express')
const router = express.Router()

const { login, signup} = require('../controllers/auth')

router
    .route('/login')
    .post((req, res) => login(req, res))

router
    .route('/signup')
    .post((req, res) => signup(req, res))


module.exports = router
