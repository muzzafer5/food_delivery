const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const Auth = require('../models').Auth
const User = require('../models').User
const SECRET_KEY = process.env.SECRET_KEY

function login(req, res) {
    Auth.findOne({
        where: { username: req.body.username}
    })
        .then(user => {
            if (user) {
                if (bcrypt.compareSync(req.body.password, user.password)) {
                    // Passwords match
                    const payload = {
                        _id: user.id,
                    }
                    console.log(payload)
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

function signup(req, res) {
    const authData = {
        username: req.body.username,
        password: req.body.password
    }
    Auth.findOne({
        where : {username: req.body.username}
    })
        .then(user => {
            if (!user) {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    authData.password = hash
                    Auth.create(authData)
                        .then(auth => {
                            User.create({ name: req.body.name, cashBalance: req.body.cashBalance, authId: auth.dataValues.id}).then(user=>{
                                res.json("Registered")
                            }).catch(err => {
                                console.log(err)
                                return res.status(422).json({ error: err })
                            })
                        })
                        .catch(err => {
                            console.log(err)
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

module.exports = {login, signup}

