/**
 * Route to send files to database as stream
 * @param express create an express applicatoin
 * @param router create an express router
 * @param upload middleware to upload files and binaries
 * @param serverUrl server url string from env
 */
import express from "express";
import upload from "../middleware/upload.js";

const router = express.Router();
const serverUrl = process.env.SERVER_URL;

router.post("/", upload.single("file"), (req, res) => {
  if (req.file === undefined) {
    return res.send({
      message: "no file selected",
    });
  } else {
    console.log("req.file", req.file);
    const imgUrl = `${serverUrl}/download/${req.file.filename}`;
    return res.status(201).send({
      url: imgUrl,
    });
  }
});

export default router;
