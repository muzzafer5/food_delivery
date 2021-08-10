const express = require('express')
const router = express.Router()

const {restaurantOpenAtCertainTime, topYRestaurant, searchRestaurant, searchDish} = require('../controllers/restaurant')

/**
 * @swagger
 * /restaurant/open?day=&time=:
 *   get:
 *     tags :
 *     - Restaurant
 *     name : Restaurant
 *     summary : Restaurant
 *     description: Fetch restaurants open at that day and time
 *     produces:
 *     - application/json
 *     parameters :
 *     - name : day
 *       description : should be atleast 2 first letter of any days, eg. Mo, thurs, wed, sunday
 *       in : query
 *       required : true
 *       type : string
 *     - name : time
 *       description : should be in hh:mm where 0 <= hh < 24
 *       in: query
 *       required : true
 *       type : string
 *     responses:
 *       200:
 *         description: The query was successful. The response will contain the list of restaurants with their ids
 *         schema:
 *            type : array
 *            items:
 *              type : object
 *              properties:
 *                Restaurant:
 *                  type: object
 *                  properties:
 *                   id:
 *                    type : integer
 *                   restaurantName:
 *                    type : string
 *       400:
 *         description: The request was invalid / incorrect day or time format.
 */

router
    .route('/open')
    .get((req, res) => restaurantOpenAtCertainTime(req, res))

router
    .route('/fetch')
    .get((req, res) => topYRestaurant(req, res))

router
    .route('/search/:restaurantName')
    .get((req, res) => searchRestaurant(req, res))

router
    .route('/search/dish/:dishName')
    .get((req, res) => searchDish(req, res))

module.exports = router
