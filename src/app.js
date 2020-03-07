const path = require('path');
const express = require('express');
// const hbs = require('hbs');
const routes = require('./routes');
const db = require('./utils/configs/db');

const app = express();
const router = express.Router();


// handle CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization, token');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST, GET, PUT, DELETE, PATCH');
    next();
});


// parse request data to JSON object
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));


// register the connection as global variable
global.db = db;


// set up handlebars engine and view location
app.set('view engine', 'hbs')//.set('views', path.join(__dirname, '../templates/views'));
// hbs.registerPartials(path.join(__dirname, '../templates/partials'))


app.use(express.static(path.join(__dirname, '../public')));
app.use('/api/v1', routes(router), (err, req, res, next) => {
    console.log(`${err.name || err.error.name} --- ${err.message || err.error.message}`)
    const isCSE = (err.name === 'TokenExpiredError') || (err.name === 'TypeError') || (err.name === 'Error');
    res.status(err.statusCode || (isCSE ? 400 : 500)).send({ status: 'error', error: err.message || err.error.message });
});


module.exports = app;
