var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var CommentsSchema = new Schema({
    title: String,
    body: String,
    user: String
});

var Comment = mongoose.model("Comment", CommentsSchema);

module.exports = Comment;