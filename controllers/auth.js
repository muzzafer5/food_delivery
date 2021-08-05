const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const Auth = require('../models').Auth
const SECRET_KEY  = 1

function Login(req, res) {
    Auth.findOne({
        where : {user: req.body.username}
    })
        .then(user => {
            if (user) {
                if (bcrypt.compareSync(req.body.password, user.password)) {
                    // Passwords match
                    const payload = {
                        _id: user._id,
                    }
                    let token = jwt.sign(payload, SECRET_KEY, {
                        expiresIn: 3600 * 24 * 30
                    })
                    res.json(token)
                }
                else {
                    return res.status(422).json({ error: "User doesn't exist" })
                }
            }
            else {
                return res.status(422).json({ error: "User doesn't exist" })
            }
        })
        .catch(err => {
            return res.status(422).json({ error: err })
        })
}

function Signup(req, res) {
    const userData = {
        username: req.body.username,
        password: req.body.password
    }
    Auth.findOne({
        username: req.body.username
    })
        .then(user => {
            if (!user) {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    userData.password = hash
                    User.create(userData)
                        .then(user_data => {
                            res.json("Registered")
                        })
                        .catch(err => {
                            return res.status(422).json({ error: err })
                        })
                })
            }
            else {
                return res.status(422).json({ error: "User already exit" })
            }
        })
        .catch(err => {
            return res.status(422).json({ error: err })
        })
}

module.exports = {Login, Signup}
