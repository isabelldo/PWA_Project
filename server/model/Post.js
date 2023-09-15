import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: String,
  location: String,
  image_id: String,
});

const Post = mongoose.model("Post", postSchema);

export default Post;
