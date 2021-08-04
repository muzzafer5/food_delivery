const express = require('express')
const router = express.Router()

const {restaurantOpenAtCertainTime, topYRestaurant} = require('../controllers/restaurant')

router
    .route('/open')
    .get((req, res) => restaurantOpenAtCertainTime(req, res))

module.exports = router
