/**
 * Route to delete files as stream by id
 * @param express create an express application
 * @param router create an express router
 * @param mongodb mongodb client
 * @param db connection to mongo
 * @param ObjectId
 */
const express = require('express');
const router = express.Router();
const mongodb = require('mongodb');
const db = require('../db/conn');
const ObjectId = require('mongodb').ObjectId

const bucket = new mongodb.GridFSBucket(db, {
  bucketName: 'posts'
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await bucket.delete(new ObjectId(id));
    console.log("result", res);
    res.status(204).send({ message: "deleted" });
  } catch (error) {
    console.log("error", error);
    res.status(404).send({ message: "id: " + id + " does not exist" });
  }
});

module.exports = router;