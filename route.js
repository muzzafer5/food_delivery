const express = require('express')
const bodyParser = require('body-parser')

const app = express()


app.use(bodyParser.json({ limit: "50mb" }));

const restaurant = require("./controllers/restaurant")

app.get('/',  (req, res) => {
    console.log("hi")
    res.send('hello world')
})

app.use("v1/api/restaurant", restaurant)

module.exports = app

