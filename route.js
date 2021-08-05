const express = require('express')
const bodyParser = require('body-parser')

const app = express()


app.use(bodyParser.json({ limit: "50mb" }));

const restaurant = require("./routes/restaurant")
const auth = require("./routes/auth")
app.get('/',  (req, res) => {
    res.send('Buying Frenzy')
})

app.use("/api/v1/restaurant", restaurant)
app.use("/api/v1/auth", auth)

module.exports = app

