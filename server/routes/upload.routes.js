/**
 * Route to send files to database as stream
 * @param express create an express application
 * @param router create an express router
 * @param upload middleware to upload files and binaries
 * @param serverUrl server url string from env
 */
const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const serverUrl = process.env.SERVER_URL;

router.post("/", upload.single("file"), async (req, res) => {
    if (req.file === undefined) {
        return res.send({
            message: "no file selected",
        });
    } else {
        //console.log("req.file", req.file);
        const imgUrl = `${serverUrl}/download/${req.file.filename}`;
        return res.status(201).send({
            url: imgUrl,
        });
    }
});

module.exports = router;
