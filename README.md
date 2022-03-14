# Food delivery system | Backend service

A backend service and a database for a food delivery platform

## Installation at local machine

Requirement : 
- Node > 11

```bash

#after clone the repository
$ go to root app directory

#create .env file
$ Add all keys from sample.env and respective values in .env file

# install required library
$ npm install

#run migration
$ npx sequelize-cli db:migrate

#extract load and transform data in mysql and elasticsearch
$ npm run etl

# development
$ npm start

```
## Deployment

- The application is hosted on heroku platform. https://buyingfrenzy.herokuapp.com/


## Access API Docs ( Swagger )

```bash
# link:
$ https://buyingfrenzy.herokuapp.com/api-docs

# in local machine
$ http://localhost:5000/api-docs

```


## Technologies

- [NodeJS](http://nodejs.org/en) is a JavaScript runtime built on Chrome's V8 JavaScript engine
- [Express JS](http://express.com) A minimalist web framework
- [Sequelize](http://docs.sequelizejs.com/) Sequelize is a promise-based ORM for Node.js v4 and up. It supports the dialects PostgreSQL, MySQL, SQLite and MSSQL and features solid transaction support, relations, read replication and more.
- [Mysql](https://www.mysql.com/) A powerful, open source object-relational database system.
- [Elastic search](https://www.elastic.co/) Elasticsearch is a search engine based on the Lucene library. 
- [Swagger](https://swagger.io/) Simpllify API development.

## Application Features

A backend service and a database for a food delivery platform

<ul>
<li> User can create account </li>
<li> User can search for restaurants by restaurant name </li>
<li> User can search for dishes by dish name </li>
<li> User can fetch top y restaurants having more or less than x dishes within price range </li>
<li> User can fetch restaurants open at certain datetime </li>
<li> User can purchase a dish from the restaurant </li>
</ul> 

