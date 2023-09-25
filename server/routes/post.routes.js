/**
 * post.router Klasse
 * @param express create an express application
 * @param router create an express router
 * @param collection database collection /posts
 * @param Post object Post
 * @param upload middleware to upload files and binaries
 * @param files db connection to collection posts.files
 * @param chunks db connection to collection chunks.files
 */
const express = require("express");
const router = express.Router();
const Post = require("../model/Post.js");
const upload = require("../middleware/upload.js");
const mongoose = require('mongoose');
require("dotenv").config();
const db = require('../db/conn');

const files = db.collection('posts.files');
const chunks = db.collection('posts.chunks');

/**
 * Function to get a complete dataset of all collections (/posts /chunks /files)
 * @param post load data by id from collection /posts
 * @param filename image_id's of this dataset
 * @param files connection to collection /files
 * @param chunks connection to collection /chunks
 * @param cursorFiles fetch data in collection /files by filename (image_id)
 * @param allFiles put cursorFiles to array
 * @param cursorChunks fetch data in collection /chunks by _id
 * @param sortedChunks chunks in sorted order
 * @param fileData create a base64 string from all these chunks
 */
async function getOnePost(id) {
    const post = await Post.findOne({_id: id});
    //console.log('post', post);
    let fileName = post.image_id;

    const docs = await files.find({filename: fileName}).toArray();

    //console.log('docs:', docs);

    if (docs.length === 0) {
        console.error('File not found');
        return null;
    }

    const chunksArray = await chunks.find({files_id: docs[0]._id}).sort({n: 1}).toArray();

    const fileData = [];
    for (const chunk of chunksArray) {
        //console.log('chunk._id', chunk._id);
        fileData.push(chunk.data.toString('base64'));
    }

    const base64file = 'data:' + docs[0].contentType + ';base64,' + fileData.join('');
    const getPost = new Post({
        "title": post.title,
        "location": post.location,
        "description": post.description,
        "image_id": base64file
    });

    //console.log('getPost', getPost);
    return getPost;
}


/**
 * Function to get all data with binaries
 * @returns dataset of all data with binaries
 */
async function getAllPosts() {
    const sendAllPosts = [];
    const allPosts = await Post.find();
    try {
        for (const post of allPosts) {
            console.log('post', post);
            const onePost = await getOnePost(post._id);
            //console.log("onePost ist:", onePost);
            sendAllPosts.push(onePost);
        }
        //console.log('sendAllPosts', sendAllPosts)
        return sendAllPosts
    } catch {
        console.log("GETALLPOSTS ELSE");
    }
}


/**
 * GET-All-Function to fetch all data from from database in collections: /posts /chunks /files
 * Call getAllPosts to fetch all posts with data from all collections
 */
router.get("/", async (req, res) => {
    try {
        getAllPosts().then((posts) => {
            res.status(200).send(posts);
        });
    } catch {
        res.status(404).send({
            error: "Post does not exist!",
        });
    }
});

/**
 * GET-BY-ID-Function to fetch data by id from from database in collections: /posts /chunks /files
 * call getAllPosts(_id: id) that creates a complete Post into all collections ;)
 *
 */
router.get("/:id", async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await getOnePost(postId);

        if (post) {
            res.status(200).send(post);
        } else {
            res.status(404).send({
                error: "Post does not exist!",
            });
        }
    } catch (error) {
        console.error("Error in getById:", error);
        res.status(500).send({
            error: "Internal server error",
        });
    }
});

/**
 * POST-Function to send data to from database in collections: /posts /chunks /files
 * Call upload() to post your binaries to /files collection
 */
router.post("/", upload.single("file"), async (req, res) => {

    if (req.file === undefined) {
        console.error("router.post() says: No file selected");
        return res.send({
            message: "no file selected",
        });
    } else {
        try {
            console.log(req.body);
            const newPost = new Post({
                title: req.body.title,
                location: req.body.location,
                description: req.body.description,
                image_id: req.file.filename,
            });
            console.log("router post:", newPost)
            await newPost.save();

            res.status(201).send(newPost);
        } catch (error) {
            console.log(error);
            res.status(500).send({
                error: "Internal server error, post not created!",
            });
        }
    }
});

/**
 * PATCH-Functoin to modify data from database in collections: /posts /chunks /files
 * @todo adjust function
 */
/* router.patch("/:id", async (req, res) => {
  try {
    const id_obj = new ObjectId(req.params.id);
    const post = await collection.findOne({ _id: id_obj });

    if (req.body.title) {
      post.title = req.body.title;
    }

    if (req.body.location) {
      post.location = req.body.location;
    }

    if (req.body.description) {
      post.description = req.body.description;
    }

    if (req.body.image_id) {
      post.image_id = req.body.image_id;
    }

    await collection.updateOne({ _id: id_obj }, { $set: post });
    res.send(post);
  } catch {
    res.status(404);
    res.send({ error: "Post does not exist! Nothing to patch" });
  }
}); */

/**
 * DELETE-Function to delete data by id from database in collections: /posts /chunks /files
 * @todo maybe adjust function
 */
router.delete('/:id', async (req, res) => {
    try {
        const post = await Post.findOne({_id: req.params.id})
        let fileName = post.image_id;
        await Post.deleteOne({_id: req.params.id});
        await files.find({filename: fileName}).toArray(async (err, docs) => {
            await chunks.deleteMany({files_id: docs[0]._id});
        })
        await files.deleteOne({filename: fileName});
        res.status(204).send()
    } catch {
        res.status(404)
        res.send({error: "Post does not exist!"})
    }
});

module.exports = router;