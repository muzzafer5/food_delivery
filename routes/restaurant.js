const express = require('express')
const router = express.Router()

var RestaurantOpenAtCertainTime = require('../controllers/restaurant')

router
    .route('/open')
    .get((req, res) => RestaurantOpenAtCertainTime(req, res))

module.exports = router
