const express = require('express')
const router = express.Router()

const { purchase } = require('../controllers/user')

const requireLogin = require('../middleware/require_login')

/**
 * @swagger
 * /user/purchase:
 *   post:
 *     tags :
 *     - User
 *     name : Place an order
 *     summary : Place an order
 *     description: Process a user purchasing a dish from a restaurant, handling all relevant data changes in an atomic transaction
 *     produces:
 *     - application/json
 *     consumes:
 *     - application/x-www-form-urlencoded
 *     parameters :
 *     - name : dishId
 *       description : id of the dish that user is going to buy
 *       in: formData
 *       required : true
 *       type : integer
 *     - name : authorization
 *       in : header
 *       required : true
 *       type: string
 *     responses:
 *       201:
 *         description: The request was successful. Order placed
 *         schema:
 *          $ref: '#/definitions/Order'
 *       400:
 *         description: The request was invalid / invalid dish id.
 *       401:
 *         description: The user was unauthorised, user must login.
 *       422:
 *         description: Insufficient balance.
 *       500:
 *         description: Internal server error, cannot process the transaction.
 */

router
    .route('/purchase')
    .post(requireLogin, (req, res) => purchase(req, res))


module.exports = router
