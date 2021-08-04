const Restaurant = require('../models').Restaurant
const Menu = require('../models').Menu
const OpenHour = require('../models').OpenHour

function RestaurantOpenAtCertainTime(req, res) {
    console.log("enter")
    res.send('success')
}

module.exports = RestaurantOpenAtCertainTime
