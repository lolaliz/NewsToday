const express = require('express'),
        mongoose = require('mongoose'),
        exphbs = require('express-handlebars'),
        bodyParser = require('body-parser'),
        logger = require('morgan'),
        path = require('path'),
        cheerio = require("cheerio");
        axios = require("axios")
        request = require("request");
         // Require all models
         db = require("./models");

//Select DB Local or Heroku DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";


const PORT = process.env.PORT || 3000;

// Initialize Express
const app = express();

// Use morgan logger for logging requests
app.use(logger("dev"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI).then( result => {
    console.log(`Connected to database '${result.connections[0].name}' on ${result.connections[0].host}:${result.connections[0].port}`);
  })
  .catch(err => console.log('There was an error with your connection:', err));;

//ROUTES

//route for SCRAPING ARTICLES

    app.get("/scrape", function(req, res) {
        
        axios.get("https://www.npr.org/sections/news/").then(function(response) {
         
          const $ = cheerio.load(response.data);
          const results = [];
         
          $("div.item-info").each(function(i, element) {
           
            const result = {};
      
           
            result.title = $(this)
              .children("h2").children("a")
              .text();
            result.link = $(this)
            .children("h2").children("a")
              .attr("href");
            result.summary = $(this)
            .children("p").children("a")
            .text();
            if (result.title !== '') {
              console.log(result.title)
              results.push(result)
          } 
          app.post("/save", function(req, res) {
            
            db.Article.create(result)
            .then(function(dbArticle) {
                console.log(dbArticle)
            })
            .catch(function(err) {
                return res.json(err);
            })
        })
    
          });
          console.log(results)
          res.send(results)
         
        })
       
      });
      
      
        app.get("/articles", function(req, res) {
            db.Article.find({})
            .then(function(dbArticle) {
            res.json(dbArticle)
            })
            .catch(function(err) {
                res.json(err)
            })
        });
    
      
  
  // Route for grabbing a specific Article by id, populate it with it's note
  app.get("/articles/:id", function(req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.findOne({ _id: req.params.id })
      // ..and populate all of the notes associated with it
      .populate("note")
      .then(function(dbArticle) {
        // If we were able to successfully find an Article with the given id, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
// Route for saving/updating an Article's associated Note/comment
app.post("/articles/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  db.Note.create(req.body)
    .then(function(dbNote) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});


//start servers
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });
