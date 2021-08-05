const express = require('express')
const router = express.Router()

const {restaurantOpenAtCertainTime, topYRestaurant, searchRestaurant} = require('../controllers/restaurant')

router
    .route('/open')
    .get((req, res) => restaurantOpenAtCertainTime(req, res))

router
    .route('/fetch')
    .get((req, res) => topYRestaurant(req, res))

router
    .route('/search/:restaurantName')
    .get((req, res) => searchRestaurant(req, res))

module.exports = router
