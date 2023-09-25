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
const express = require ("express");
const router = express.Router();
const Post = require("../model/Post.js") ;
const upload = require("../middleware/upload.js");
const mongoose = require('mongoose');
require("dotenv").config();
const db = require('../db/conn');

const files = db.collection("posts.files");
const chunks = db.collection("posts.chunks");


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
function getOnePost(id) {
    return new Promise(async (resolve, reject) => {
        try {
            const post = await Post.findOne({ _id: id });
            let fileName = post.image_id;

            const cursorFiles = files.find({filename: fileName});
            const allFiles = await cursorFiles.toArray();
            const cursorChunks = chunks.find({files_id : allFiles[0]._id});
            const sortedChunks = cursorChunks.sort({n: 1});
            const fileData = [];

            for await (const chunk of sortedChunks) {
                    fileData.push(chunk.data.toString('base64'));
                }

            let base64file = 'data:' + allFiles[0].contentType + ';base64,' + fileData.join('');
            let getPost = new Post({
                    "_id": post._id,
                    "title": post.title,
                    "location": post.location,
                    "description": post.description,
                    "image_id": base64file,
                });

            resolve(getPost);
    } catch {
        reject(new Error("getOnePost() says: Post doesn't exist"));
        }
    })
}

/**
 * Function to get all data with binaries
 * @returns dataset of all data with binaries
 */
function getAllPosts() {
    return new Promise( async(resolve, reject) => {
        const sendAllPosts = [];
        const allPosts = await Post.find();
        try {
            for (const post of allPosts) {
                console.log('post', post);
                const onePost = await getOnePost(post._id);
                sendAllPosts.push(onePost);
            }
            console.log('sendAllPosts', sendAllPosts);
            resolve(sendAllPosts);
        } catch {
            reject(new Error("getAllPosts() says: Posts do not exist!"));
        }
    });
}

/**
 * GET-All-Function to fetch all data from from database in collections: /posts /chunks /files
 * Call getAllPosts to fetch all posts with data from all collections
 */
router.get("/", async (req, res) => {

        getAllPosts().then( (posts) => {
                console.log('post', posts);
                res.status(200);
                res.send(posts);
        })
            .catch ( () => {
                res.status(404);
                res.send({
                error: "Router / says: Post does not exist!",
            });
    });
});

/**
 * GET-BY-ID-Function to fetch data by id from from database in collections: /posts /chunks /files
 * call getAllPosts(_id: id) that creates a complete Post into all collections ;)
 *
 */
router.get("/:id", async (req, res) => {
    getOnePost(req.params.id).then( (post) => {
            console.log('post', post);
            res.status(200).send(post)
        })
        .catch ( () => {
            res.status(404).send({
            error: "Router /:id says: Post does not exist!",
        });
    })
});

/**
 * POST-Function to send data to from database in collections: /posts /chunks /files
 * Call upload() to post your binaries to /files collection
 */
router.post("/", upload.single("file"), async (req, res) => {
    console.log("router.post() says: Req:", req);

    if (req.file === undefined) {
        console.error("router.post() says: No file selected");
        return res.send({
            message: "no file selected",
        });
    } else {
        try {
            const newPost = new Post({
                title: req.body.title,
                location: req.body.location,
                image_id: req.body.image_id,
            });
            console.log("router.post() says: newPost:", newPost);
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
router.delete('/:id', async(req, res) => {
    try {
        const post = await Post.findOne({ _id: req.params.id })
        let fileName = post.image_id;
        await Post.deleteOne({ _id: req.params.id });
        await files.find({filename: fileName}).toArray( async(err, docs) => {
            await chunks.deleteMany({files_id : docs[0]._id});
        })
        await files.deleteOne({filename: fileName});
        res.status(204).send()
    } catch {
        res.status(404)
        res.send({ error: "Post does not exist!" })
    }
});

module.exports = router;