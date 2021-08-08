const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const Auth = require('../models').Auth
const User = require('../models').User
const SECRET_KEY = process.env.SECRET_KEY

function login(req, res) {
    if (!('username' in req.body)){
        return res.status(400).json({error : "username missing"})
    }
    if (!('password' in req.body)) {
        return res.status(400).json({ error: "password missing" })
    }
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
                    let token = jwt.sign(payload, SECRET_KEY, {
                        expiresIn: 3600 * 24 * 30
                    })
                    return res.status(200).json({ authToken : token})
                }
                else {
                    return res.status(404).json({ error: "user was not found or the password was incorrect" })
                }
            }
            else {
                return res.status(404).json({ error: "user was not found or the password was incorrect" })
            }
        })
        .catch(err => {
            return res.status(400).json({ error: err })
        })
}

function signup(req, res) {
    if (!('username' in req.body)) {
        return res.status(400).json({ error: "username missing" })
    }
    if (!('password' in req.body)) {
        return res.status(400).json({ error: "password missing" })
    }
    if (!('name' in req.body)) {
        return res.status(400).json({ error: "name missing" })
    }
    if (!('cashBalance' in req.body)) {
        return res.status(400).json({ error: "cashBalance missing" })
    }
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
                                res.status(200).send("user registered!")
                            }).catch(err => {
                                return res.status(400).json({ error: err })
                            })
                        })
                        .catch(err => {
                            return res.status(400).json({ error: err })
                        })
                })
            }
            else {
                return res.status(409).json({ error: "User already exit" })
            }
        })
        .catch(err => {
            return res.status(400).json({ error: err })
        })
}

module.exports = {login, signup}

