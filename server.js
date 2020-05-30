// scraping tools
// axios = a promise-based http library
const cheerio = require("cheerio");
const axios = require("axios");

const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");

// initializes Express
let app = express();

// database configuration
const db = require("./models");

let PORT = process.env.PORT || 3030;

// use morgan logger for logging requests
app.use(logger("dev"));
// parse request body as JSON
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect("mongodb://localhost/austin-documented", {useNewUrlParser: true});

app.get("/scrape", (req, res) => {
    let linkArray = [];
    axios.get("https://austin.eater.com/").then(response => {
        let $ = cheerio.load(response.data);
        $("div .c-entry-box--compact--article").each(function(i, element) {
            let link = $(this)
                .children("div").children("h2").children("a")
                .attr("href");
            linkArray.push(link);
        });

        for (let i = 0; i < linkArray.length; i++) {
            axios.get(String(linkArray[i])).then(response => {
                let result = {};
                result.link = linkArray[i];
                const $ = cheerio.load(response.data);
                result.title = $("h1.c-page-title").text();
                result.summary = $("p.c-entry-summary").text();
                result.time = $("time.c-byline__item").attr("datetime");
                result.img = $("span.e-image__image").attr("data-original");
                result.source = "Eater Austin"
                // console.log(time);

                db.Article.create(result)
                .then(dbArticles => {
                console.log(dbArticles);
                // console.log("articles scraped");
                })
                .catch(err => {
                    console.log(err);
                })
            })
        }
        console.log(linkArray);
    })
    res.send("howdy");
})


app.get("/articles", (req, res) => {
    db.Article.find().sort({ time: -1})
        .then(dbArticles => {
            res.json(dbArticles);
            console.log(dbArticles);
        })
        .catch((err) => {
            res.json(err);
        })
})

// grabs article by its id
app.get("/articles/:id", (req, res) => {
    db.Article.findOne({_id: req.params.id})
        // populates all the comments associated with it
        .populate("comment")
        .then(dbArticles => {
            res.json(dbArticles);
        })
        .catch(err => {
            res.json(err);
        })
})

// saves and updates an article's assoc comment
app.post("/articles/:id", (req, res) => {
    console.log(req.body); // req.body = { body: "hello" }
    console.log(req.params);
    // creates a new note, data passed through req.body
    db.Comment.create(req.body)
        .then(dbComments => {
            console.log(dbComments);
            console.log(dbComments._id);
            // id matches req.params.id
            // {new:true} updates the article
            return db.Article.findOneAndUpdate(
                { _id: req.params.id },
                // { comment: {
                //     // dbComments._id,
                //     body: req.body.body
                //   }
                // },
                {$push: {comment: JSON.stringify(dbComments._id)}},
                { new: true}
            );
        })
        .then(dbArticles => {
            console.log("Below's console log is line 114");
            console.log(dbArticles);
            res.json(dbArticles);
        })
        .catch(err => {
            res.json(err);
        })
})

app.listen(PORT, () => {
    console.log("App running on localhost:" + PORT);
})