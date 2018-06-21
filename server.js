const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const logger = require('morgan');
const mongoose = require('mongoose');
const axios = require('axios');
const cheerio = require('cheerio');

var db = require('./models');

var PORT = 3000;

var app = express();

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/mongoScraper';

// mongoose.Promise = Promise;
// mongoose.connect(MONGODB_URI);

app.get("/scrape", function(req, res) {
    axios.get("https://www.npr.org/sections/world/")
    .then(function(response) {

        const $ = cheerio.load(response.data);

        $("article").each(function(i, element) {

            let result = {};

            result.image = $(this).children("div").children("div").children("a").children("img").attr("src");
            result.link = $(this).children("div").children("div").children("a").attr("href");
            result.title = $(this).children("div").children("h2").text();
            result.teaser = $(this).children("div").children("p").children("a").text();


            db.Article.create(result)
            .then(function(dbArticle) {
                console.log(dbArticle);
            })
            .catch(function(error) {
                return res.json(error);
            });
        });

        res.send("Scrape Complete");
    });
});

// app.get("/articles", function(req, res) {
//     db.Article.find({})

//  ===========================================
// })

// TODO: finish routes get and post and delete articles/notes



app.listen(PORT, function() {
    console.log('Magic happening on localhost:' + PORT);
});