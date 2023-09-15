/**
 * Route to download files to database as stream
 */
import express from "express";
const router = express.Router();
import mongodb from "mongodb";
import database from "../db/conn.js";

const bucket = new mongodb.GridFSBucket(database, {
  bucketName: "posts",
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

export default router;
