// scraping tools
// axios = a promise-based http library


const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");

// initializes Express
let app = express();

// database configuration


let PORT = process.env.PORT || 3030;

// use morgan logger for logging requests
app.use(logger("dev"));
// parse request body as JSON
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(express.static("public"));

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/austin-documented";

mongoose.connect(MONGODB_URI);

require("./routes/apiRoutes") (app);
require("./routes/htmlRoutes") (app);



app.listen(PORT, () => {
    console.log("App running on localhost:" + PORT);
})