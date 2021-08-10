const express = require('express');
const router = express.Router();

const {searchDish} = require("../controllers/dish")

/**
 * @swagger
 * /dish/search/{dishName}:
 *   get:
 *     tags :
 *     - Dish
 *     name : Search dish
 *     summary : Search dish
 *     description: Search for dish by name, ranked by relevance to search term
 *     produces:
 *     - application/json
 *     parameters :
 *     - name : dishName
 *       description : name of the dish you want to search
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
 *                  type: number
 *                  format: double
 *                _source:
 *                  type: object
 *                  properties:
 *                   name:
 *                    type : string
 *       400:
 *         description: The request was invalid / dishName missing.
 */

router
    .route('/search/:dishName')
    .get((req, res) => searchDish(req, res))

module.exports = router
