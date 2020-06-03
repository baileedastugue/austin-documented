const cheerio = require("cheerio");
const axios = require("axios");
const db = require("../models");
const express = require("express");
const router = express.Router();

    

    router.get("/scrape", (req, res) => {
        // this grabs the html website body
        axios.get("https://austin.eater.com/").then(response => {
            // load the html body into cheerio, saving it as $
            let $ = cheerio.load(response.data);
            let linkArray = [];
            let result = {};
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
                    result.title = $("h1.c-page-title").text().trim();
                    result.summary = $("p.c-entry-summary").text().trim();
                    result.time = $("time.c-byline__item").attr("datetime");
                    result.img = $("span.e-image__image").attr("data-original");
                    result.source = "Eater Austin"
                    
                    db.Article.create(result)
                            .then(dbArticle => {
                            })
                            .catch(err => {
                                console.log(err);
                            }) 
                    // let query = result.title;
                    // db.Article.find({ title: query }).then(response => {
                    //     // console.log("hello from line 43");
                    //     console.log(response);
                    //     // on first attempt, response = [], an empty array
                    //     // after it's been populated, the response is a single object in the array
                    //     // if (response.length === 0) {
                    //         console.log("already in db");
                    //     // } else {
                    //     // }
                    // })
                       
                }) 
            }
            // console.log(resultArray);
        })
        .then(axios.get("https://austin.culturemap.com/").then(response => {
            let $ = cheerio.load(response.data);
            let linkArray = [];
            let result = {};
            $("div.kicker").each(function(i, element) {
                // let link = "https://austin.culturemap.com"
                let link = $(this)
                    .siblings("a")
                    .attr("href");
                if (!link.includes("https")) {
                    link = "https://austin.culturemap.com/" + link;
                }
                if (!linkArray.includes(link)) {
                    linkArray.push(link);
                }
            })
            // console.log(linkArray);
            for (let i = 0; i < linkArray.length-1 ; i++) {
                axios.get(String(linkArray[i])).then(response => {
                    result.link = linkArray[i];
                    const $ = cheerio.load(response.data);
                    result.summary = $("div.article").children("div.kicker").text();
                    result.title = $("h1.headline.hidden-xs").text().trim();
                    result.time = $("time").attr("datetime");
                    result.img = $("div.slide-container#slide0").children("img.slide-img").attr("src");
                    result.source = "Austin Culture Map"
                    // console.log(result);
                    db.Article.create(result)
                            .then(dbArticle => {
                            })
                            .catch(err => {
                                console.log(err);
                            }) 
                }) 
            }
        }))
        .then(axios.get("https://www.austinmonthly.com/").then(response => {
            let $ = cheerio.load(response.data);
            let linkArray = [];
            let result = {};
            $(".entry-title").each(function(i, element) {
                let link = $(this)
                    .children("a")
                    .attr("href");
                if (!linkArray.includes(link)) {
                    linkArray.push(link);
                }
            })
            // console.log(linkArray);
            for (let i = 0; i < linkArray.length-1 ; i++) {
                axios.get(String(linkArray[i])).then(response => {
                    result.link = linkArray[i];
                    const $ = cheerio.load(response.data);
                    result.summary = $(".entry-subtitle").text().trim();
                    result.title = $("div.entry-container").children("div.entry-main").children(".entry-title").text().trim();
                    let date= $("div.entry-date").children().text().trim();
                    if (String(date).includes("Published: ")) {
                        date = date.split(": ").pop();
                        console.log(date);
                    }
                    result.time = date;
                    result.img = $("figure.post-thumbnail").children("img").attr("src");
                    result.source = "Austin Monthly"
                    console.log(result);
                    db.Article.create(result)
                            .then(dbArticle => {
                            })
                            .catch(err => {
                                console.log(err);
                            }) 
                }) 
            }
        }))
        .then(() => {
            return res.redirect("/");
        })
    });

    router.get("/", (req, res) => {
        db.Article.find({}).sort({ time: -1}).lean()
            .then(function(dbArticle) {
                // console.log(dbArticle);
                let hbsObject = {
                    articles: dbArticle
                };
                // console.log(hbsObject);
                res.render("index", hbsObject);
            })
    })

    router.get("/saved", (req, res) => {
        db.Article.find({
            saved: true
        }).lean()
            .then(function(dbArticle) {
                // console.log(dbArticle);
                let hbsObject = {
                    articles: dbArticle
                };
                res.render("saved", hbsObject);
            })
        
    })

    router.get("/clear", (req, res) => {
        db.Article.find({}).deleteMany({}).then(dbArticle => {
        })
        .then(() => {
            return res.redirect("/");
        })
        .catch((err) => {
            res.json(err);
        })
    })
    
    router.get("/articles", (req, res) => {
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
    router.get("/articles/:id", (req, res) => {
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
    router.post("/articles/:id", function(req, res) {
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
    router.get("/comments", function (req, res) {
        db.Comment.find({})
        .then(function(dbComments) {
            res.json(dbComments);
        })
        .catch(function(err) {
            res.json(err);
        })
    })

    router.put("/saved/:id", (req, res) => {
        var condition = "id = " + req.params.id;
        db.Article.findOneAndUpdate({
            _id: req.params.id
        }, {saved: true})
            .then(dbArticle => {
                res.json(dbArticle);
            })
            .catch(err => {
                res.json(err);
            })
    })

    router.put("/unsaved/:id", (req, res) => {
        var condition = "id = " + req.params.id;
        db.Article.findOneAndUpdate({
            _id: req.params.id
        }, {saved: false})
            .then(dbArticle => {
                res.json(dbArticle);
            })
            .catch(err => {
                res.json(err);
            })
    })

    module.exports = router;
