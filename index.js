require("dotenv").config()
const app = require('./route')
const port = process.env.APP_PORT

app.listen(port, function () {
    console.log('Server is running on port: ' + port)
});

