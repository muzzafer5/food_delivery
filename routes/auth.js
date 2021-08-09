const express = require('express')
const router = express.Router()

const { login, signup} = require('../controllers/auth')

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags : 
 *     - Auth
 *     name : Login
 *     summary : Login
 *     description: Login to place orders
 *     produces:
 *     - application/json
 *     consumes: 
 *     - application/x-www-form-urlencoded
 *     parameters : 
 *     - name : username
 *       description : username of the user
 *       in: formData
 *       required : true    
 *       type : string
 *     - name : password
 *       description : password of the user
 *       in: formData
 *       required : true
 *       type : string
 *     responses:
 *       200:
 *         description: The authentication was successful. The response will contain the authentication token
 *         schema:
 *            type : object
 *            properties: 
 *              authToken:
 *                type : string
 *       400:
 *         description: The request was invalid / username missing or password missing.
 *       404:
 *         description: The user was not found or the password was incorrect.
 */
router
    .route('/login')
    .post((req, res) => login(req, res))

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     tags :
 *     - Auth
 *     name : Signup
 *     summary : Signup
 *     description: Signup to the platform
 *     produces:
 *     - application/json
 *     consumes:
 *     - application/x-www-form-urlencoded
 *     parameters :
 *     - name : username
 *       description : username of the user
 *       in: formData
 *       required : true
 *       type : string
 *     - name : password
 *       description : password of the user
 *       in: formData
 *       required : true
 *       type : string
 *     - name : name
 *       description : full name of the user
 *       in: formData
 *       required : true
 *       type : string
 *     - name : cashBalance
 *       description : cashBalance of the user
 *       in: formData
 *       required : true
 *       type : float
 *     responses:
 *       200:
 *         description: The request was successful.
 *       400:
 *         description: The request was invalid / username or password or name or cashBalance missing.
 *       409:
 *         description: The user was already exist.
 */
router
    .route('/signup')
    .post((req, res) => signup(req, res))

module.exports = router
