const express = require('express')
const app = express()

// allow parsing large request
app.use(express.urlencoded({
    limit: "50mb",
    extended: false
}));
app.use(express.json({ limit: "50mb" }));

const restaurant = require("./routes/restaurant");
const auth = require("./routes/auth");
const user = require("./routes/user");

// get request at host
app.get('/',  (req, res) => {
    res.send('Buying Frenzy');
})

// base paths for differents components
app.use("/api/v1/restaurant", restaurant);
app.use("/api/v1/auth", auth);
app.use("/api/v1/user", user);

module.exports = app;

