const express = require('express');
const router = express.Router();

const {restaurantOpenAtCertainTime, topYRestaurant, searchRestaurant, searchDish} = require('../controllers/restaurant');

/**
 * @swagger
 * /restaurant/open?day=&time=:
 *   get:
 *     tags :
 *     - Restaurant
 *     name : Open at
 *     summary : Open at
 *     description: List all restaurants open at certain day and time
 *     produces:
 *     - application/json
 *     parameters :
 *     - name : day
 *       description : should be atleast 2 first letter of any days, eg. Mo, thurs, wed, sunday. Defualt value is today's day
 *       in : query
 *       type : string
 *     - name : time
 *       description : should be in hh:mm where 0 <= hh < 24. Defualt value is current time
 *       in: query
 *       type : string
 *     responses:
 *       200:
 *         description: The query was successful. The response will contain the list of restaurants with their ids.
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


/**
 * @swagger
 * /restaurant/fetch?y=&x=&min_price=&max_price=&lesser=:
 *   get:
 *     tags :
 *     - Restaurant
 *     name : Fetch top y
 *     summary : Fetch top y
 *     description: List top y restaurants that have more or less than x number of dishes within a price range
 *     produces:
 *     - application/json
 *     parameters :
 *     - name : y
 *       description : to fetch top y
 *       in : query
 *       type : integer
 *       required : true
 *     - name : x
 *       description : x number of dishes
 *       in : query
 *       type : integer
 *       required : true
 *     - name : min_price
 *       description : defualt value is 0
 *       in : query
 *       type : float
 *     - name : max_price
 *       description : defualt value is INF
 *       in: query
 *       type : float
 *     - name : lesser
 *       description : if true then show top y have less than x dish within price range, default value is false
 *       in: query
 *       type : bool
 *     responses:
 *       200:
 *         description: The query was successful. The response will contain the list of restaurants with their ids and dish count within price range
 *         schema:
 *            type : array
 *            items:
 *              type : object
 *              properties:
 *                dishCount:
 *                  type: integer
 *                Restaurant:
 *                  type: object
 *                  properties:
 *                   id:
 *                    type : integer
 *                   restaurantName:
 *                    type : string
 *       400:
 *         description: The request was invalid / x or y missing/invalid, min_price or max_price invalid
 */

router
    .route('/fetch')
    .get((req, res) => topYRestaurant(req, res))

/**
 * @swagger
 * /restaurant/search/{restaurantName}:
 *   get:
 *     tags :
 *     - Restaurant
 *     name : Search restaurant
 *     summary : Search restaurant
 *     description: Search for restaurants by name, ranked by relevance to search term
 *     produces:
 *     - application/json
 *     parameters :
 *     - name : restaurantName
 *       description : name of the restaurant you want to search
 *       in : path
 *       type : string
 *     responses:
 *       200:
 *         description: The query was successful. The response will contain the list of restaurants with their ids.
 *         schema:
 *            type : array
 *            items:
 *              type : object
 *              properties:
 *                _index:
 *                  type: string
 *                _type:
 *                  type: string
 *                _id:
 *                  type: string
 *                _score: 
 *                  type: string
 *                _source:
 *                  type: object
 *                  properties:
 *                   name:
 *                    type : string
 *       400:
 *         description: The request was invalid / restaurantName missing.
 */

router
    .route('/search/:restaurantName')
    .get((req, res) => searchRestaurant(req, res))

module.exports = router
