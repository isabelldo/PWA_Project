const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    title: String,
    location: String,
    description: String,
    image_id: String
});

module.exports = mongoose.model('Post', postSchema);