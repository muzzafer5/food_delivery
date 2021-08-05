const express = require('express')
const router = express.Router()

const { purchase } = require('../controllers/user')

const requireLogin = require('../middleware/require_login')

router
    .route('/purchase')
    .post(requireLogin, (req, res) => purchase(req, res))


module.exports = router
