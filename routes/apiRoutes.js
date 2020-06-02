const cheerio = require("cheerio");
const axios = require("axios");
const db = require("../models");
const path = require("path");

module.exports = function(app) {
    let linkArray = [];
    let result = {};

    app.get("/scrape", (req, res) => {
        axios.get("https://austin.eater.com/").then(response => {
            let $ = cheerio.load(response.data);
            $("h2.c-entry-box--compact__title").each(function(i, element) {
                let link = $(this)
                    .children("a")
                    .attr("href");
                if (!linkArray.includes(link)) {
                    linkArray.push(link);
                }
            });
            for (let i = 0; i < linkArray.length-1 ; i++) {
                axios.get(String(linkArray[i])).then(response => {
                    result.link = linkArray[i];
                    const $ = cheerio.load(response.data);
                    result.title = $("h1.c-page-title").text();
                    result.summary = $("p.c-entry-summary").text();
                    result.time = $("time.c-byline__item").attr("datetime");
                    result.img = $("span.e-image__image").attr("data-original");
                    result.source = "Eater Austin"
            
                    let query = result.title;
                    console.log(i, query);
                    db.Article.findOne({title: query}, function (err, example) {
                        if (err) console.log(err);
                        // console.log(example);
                        // if the article hasn't been scraped --> returns null (false)
                        // if the article has been scraped --> returns article (true)
                        else if (example) {
                            console.log("this has already been scraped");
                        } 
                        else {
                            db.Article.create(result)
                                .then(dbArticle => {
                                })
                                .catch(err => {
                                    console.log(err);
                                })
                        }
                    })
                    
                }) 
            }
        })
        .then(function () {
            return res.redirect('/');
        })
    });
    
    app.get("/articles", (req, res) => {
        db.Article.find().sort({ time: -1})
            .populate("Article")
            .then(dbArticle => {
                res.json(dbArticle);
                // console.log(dbArticle);
            })
            .catch((err) => {
                res.json(err);
            })
    })
    
    // grabs article by its id
    app.get("/articles/:id", (req, res) => {
        db.Article.find({
            _id: req.params.id
        })
            // populates all the comments associated with it
            .populate("comment")
            .then(function(dbArticle) {
                res.json(dbArticle);
            })
            .catch(err => {
                res.json(err);
            })
    })
    
    // saves and updates an article's assoc comment
    app.post("/articles/:id", function(req, res) {
        // Create a new Note in the db
        db.Comment.create(req.body)
          .then(function(dbComments) {
            return db.Article.findOneAndUpdate({
                _id: req.params.id
            }, { $push: { comment: dbComments._id } }, { new: true });
          })
          .then(function(dbArticle) {
            // If the User was updated successfully, send it back to the client
            res.json(dbArticle);
          })
          .catch(function(err) {
            // If an error occurs, send it back to the client
            res.json(err);
          });
      });
    
    // returns all comments
    app.get("/comments", function (req, res) {
        db.Comment.find({})
        .then(function(dbComments) {
            res.json(dbComments);
        })
        .catch(function(err) {
            res.json(err);
        })
    })
}
