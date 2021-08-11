require("dotenv").config();
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express')
const port = process.env.PORT;
const app = require('./route');
const client = require('./config/elasticsearch');
const models = require("./models");

// checking mysql db connection
models.sequelize.sync().then(() => {
    console.log("mysql db connected");
}).catch(() => {
    console.log("error in mysql connection");
})

// checking elasticsearch connection
client.ping((error) => {
    if (error) {
        console.trace('elasticsearch cluster is down!');
    } console.log('elasticsearch connected');
});

// swagger documention configuration
const options = {
    definition: {
        swagger: "2.0",
        info: {
            title: 'Buying Frenzy',
            version: '1.0.0',
            description: "A backend service for a food delivery platform",
            contact: {
                email: "muzzaferali5@gmail.com"
            },
        },
        schemes: ["https"],
        host: process.env.NODE_ENV === "production" ? "buyingfrenzy.herokuapp.com": "localhost:5000",
        basePath: "/api/v1"
    },
    apis: ["./routes/*.js", "./models/*.js"], // files containing annotations as above
};

const openapiSpecification = swaggerJsdoc(options);
var cssOption = {
    customCss: '.swagger-ui .topbar { display: none }'
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification, cssOption));

app.listen(port, function () {
    console.log('Server is running on port: ' + port);
});

