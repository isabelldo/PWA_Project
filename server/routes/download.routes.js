/**
 * Route to download files to database as stream
 */

const express = require('express');

const router = express.Router();
const mongodb = require('mongodb')
const db = require('../db/conn');

const bucket = new mongodb.GridFSBucket(db, {
    bucketName: 'posts'
});

router.get("/:filename", async (req, res) => {
    try {
        const filename = req.params.filename;
        let downloadStream = bucket.openDownloadStreamByName(filename);
        downloadStream.on("data", (data) => res.status(200).write(data));
        downloadStream.on("error", (err) =>
            res.status(404).send({ message: filename + " does not exist", err })
        );
        downloadStream.on("end", () => res.end());
    } catch (error) {
        console.log("error", error);
        res.send("not found");
    }
});

module.exports = router;