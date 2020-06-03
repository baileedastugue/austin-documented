const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");

// initializes Express
let app = express();

let PORT = process.env.PORT || 3030;

// use morgan logger for logging requests
app.use(logger("dev"));
// parse request body as JSON
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static(__dirname + "/public"));
app.set('views', __dirname + '/public/views');

var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");


var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/austin-documented";

mongoose.connect(MONGODB_URI);

var routes = require("./controllers/apiRoutes.js");
app.use(routes);




app.listen(PORT, () => {
    console.log("App running on localhost:" + PORT);
})