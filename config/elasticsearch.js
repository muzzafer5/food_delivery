const { Client } = require('@elastic/elasticsearch');
require("dotenv").config();

//creating elasticsearch client
const client = new Client({
    node: process.env.ElasticURI,
    auth: {
        username: process.env.ElasticUserName,
        password: process.env.ElasticPassword,
    }
});

module.exports = client;
