require("dotenv").config()
const app = require('./route')
const port = process.env.APP_PORT
const client = require('./config/elasticsearch')
var models = require("./models");

// checking mysql db connection
models.sequelize.sync().then(() => {
    console.log("mysql db connected")
}).catch(() => {
    console.log("error in mysql connection")
})


// checking elasticsearch connection
client.ping((error) => {
    if (error) {
        console.trace('elasticsearch cluster is down!');
    } console.log('elasticsearch connected');
});

app.listen(port, function () {
    console.log('Server is running on port: ' + port)
});

