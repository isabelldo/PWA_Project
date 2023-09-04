/*
const express = require('express');
const router = express.Router();
const cors = require('cors');
const { collection } = require('../db/conn');
const  ObjectId = require('mongodb').ObjectId;

const baseUrl = 'http://127.0.0.1:3000/posts/';

// GET all posts
/!*router.get('/', cors(), async(req, res) => {
    const allPosts = await collection.find().toArray();
    res.status(200);
    res.send(allPosts);
});*!/

// GET all posts
fetch(baseUrl, {
    method: 'GET',
    headers: {
        'Accept': 'application/json'
        }
    })
    .then(
        response => {
            return response;
        }
    )
    .catch(
        err => {
            console.log(err);
        }
    )


// GET one post
/!*router.get('/:id', cors(), async(req, res) => {

    try {
        const id_obj = new ObjectId(req.params.id);
        const post = await collection.find( {_id: id_obj } ).toArray();
        console.log('post', req.params.id)
        res.status(202);
        res.send(post);
    } catch {
        res.status(404);
        res.send({
            error: "Post does not exist!"
        });
    }
});*!/

// GET one post
fetch(url+'/:id', {
    method: 'GET',
    headers: {
        'Accept': 'application/json'
    }
})
    .then(
        response => {
            return response;
        }
    )
    .catch(
        err => {
            console.log(err);
        }
    )


// POST one new post
router.post('/', async(req, res) => {

    try {
        const newPost = {
            title: req.body.title,
            location: req.body.location,
            image_id: req.body.image_id,
            description: req.body.description,
            likes: req.body.likes
        }
        const result = await collection.insertOne(newPost);
        res.status(201);
        res.send(result);
    } catch {
        res.status(404);
        res.send({
            error: "Post does not exist!"
        });
    }
});

// GET one post
fetch(url+'/:id', {
    method: 'POST',
    headers: {
        'Content-Type' : 'application/json',
        'Accept': 'application/json'
    },
    body: JSON.stringify({
        title: req.body.title,
        location: req.body.location,
        image_id: req.body.image_id,
        description: req.body.description,
        likes: req.body.likes
        }
    )
})
    .then( response => {
        console.log('Data sent to backend ...', response);
        return response.json();
    })
    .then( data => {
        console.log('data ...', data);
        updateUI(Object.entries(data));
    });


// PATCH (update) one post
router.patch('/:id', async(req, res) => {
    try {
        const id_obj = new ObjectId(req.params.id);
        const post = await collection.findOne({ _id: id_obj })

        if (req.body.title) {
            post.title = req.body.title
        }

        if (req.body.location) {
            post.location = req.body.location
        }

        if (req.body.image_id) {
            post.image_id = req.body.image_id
        }

        if (req.body.description) {
            post.description = req.body.description
        }

        if (req.body.likes) {
            post.likes = req.body.likes
        }

        await collection.updateOne({ _id: id_obj }, { $set: post });
        res.send(post)
    } catch {
        res.status(404)
        res.send({ error: "Post does not exist!" })
    }
});

// DELETE one post via id
router.delete('/:id', async(req, res) => {
    try {
        const id_obj = new ObjectId(req.params.id);
        const post = await collection.deleteOne({ _id: id_obj })
        console.log('post', post)
        if(post.deletedCount === 1) {
            res.status(204)
            res.send( { message: "deleted" })
        } else {
            res.status(404)
            res.send({ error: "Post does not exist!" })
        }
    } catch {
        res.status(404)
        res.send({ error: "something went wrong" })
    }
});



module.exports = router;

*/
