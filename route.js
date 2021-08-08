const express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.use(express.urlencoded({
    limit: "50mb",
    extended: false
}));
app.use(express.json({ limit: "50mb" }));

const restaurant = require("./routes/restaurant")
const auth = require("./routes/auth")
const user = require("./routes/user")

app.get('/',  (req, res) => {
    res.send('Buying Frenzy')
})

app.use("/api/v1/restaurant", restaurant)
app.use("/api/v1/auth", auth)
app.use("/api/v1/user", user)

module.exports = app

