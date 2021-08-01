require("dotenv").config()
const app = require('./route')
const port = process.env.APP_PORT

var models = require("./models");

models.sequelize.sync().then(() => {
    console.log("connected")
}).catch(() => {
    console.log("error")
})

app.listen(port, function () {
    console.log('Server is running on port: ' + port)
});

