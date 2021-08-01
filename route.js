const express = require('express')
const bodyParser = require('body-parser')

const app = express()


app.use(bodyParser.json({ limit: "50mb" }));

module.exports = app

