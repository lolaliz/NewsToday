const express = require('express'),
        mongoose = require('mongoose'),
        exphbs = require('express-handlebars'),
        bodyParser = require('body-parser'),
        logger = require('morgan'),
        path = require('path'),
        cheerio = require("cheerio");

//Select DB Local or Heroku DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/mongoHeadlines";
// Require all models
//const db = require("./models");

const PORT = 3000;

// Initialize Express
const app = express();

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI).then( result => {
    console.log(`Connected to database '${result.connections[0].name}' on ${result.connections[0].host}:${result.connections[0].port}`);
  })
  .catch(err => console.log('There was an error with your connection:', err));;

//ROUTES


//start server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });
