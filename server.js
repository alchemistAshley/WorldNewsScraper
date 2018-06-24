const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const logger = require('morgan');
const mongoose = require('mongoose');
const axios = require('axios');
const cheerio = require('cheerio');

const db = require('./models');

const PORT = 3000;

const app = express();
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('views'));

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/mongoScraper';
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

app.get("/scrape", function(req, res) {
    axios.get("https://www.npr.org/sections/world/")
    .then(function(response) {

        const $ = cheerio.load(response.data);

        $("article").each(function(i, element) {

            let result = {};

            // result.image = $(this).children("div").children("div").children("a").children("img").attr("src");
            result.link = $(this).children("div").children("div").children("a").attr("href");
            result.title = $(this).children("div").children("h2").text();
            result.teaser = $(this).children("div").children("p").children("a").text();

            if (result.teaser == undefined) {
                result.teaser = "";
            }

            db.Article.create(result)
            .then(function(dbArticle) {
                console.log(dbArticle);
            })
            .catch(function(error) {
                console.log(error);
            });
        });

        res.redirect("/");
    });
});

app.get("/", function(req, res) {

    db.Article.find({})
    .then(function(dbArticle) {
        res.render("index", { article: dbArticle } );
    })
    .catch(function(error) {
        console.log(error);
    });
});

app.get("/articles", function(req, res) {
    db.Article.find({})
    .then(function(dbArticle) {
        res.json(dbArticle);
    })
    .catch(function(error) {
        res.json(error);
    });
});

app.get("/articles/:id", function(req, res){
    db.Article.findOne({ _id: req.params.id })
    .populate("note")
    .then(function(dbArticle) {
        res.json(dbArticle);
    })
    .catch(function(error) {
        res.json(error);
    });
});

app.post("/articles/:id", function(req, res) {
    db.Note.create(req.body)
    .then(function(dbNote) {
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbArticle) {
        res.json(dbArticle);
    })
    .catch(function(error) {
        res.json(error);
    });
});

// route for starring?

app.listen(PORT, function() {
    console.log('Magic happening on localhost:' + PORT);
});
