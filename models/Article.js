var mongoose = require("mongoose");

// reference to the Schema constructtor
var Schema = mongoose.Schema;
var ArticleSchema = new Schema ({
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    img: {
        type: String
    },
    summary: {
        type: String,
        required: true
    },
    time: {
        type: Date
    },
    source: {
        type: String,
        required: true
    },
    // note = object that stores a Note ID - this links the ObjectID to the Note model
    // allows us to populate the article with an associated note
    comment: [
        {
        type: Schema.Types.ObjectId,
        ref: "Comment"
        }
    ]
});

// create model from the defined schema, using mongoose's model method
var Article =  mongoose.model("Article", ArticleSchema);

module.exports = Article;