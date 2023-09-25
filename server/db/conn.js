const mongoose = require("mongoose");
require('dotenv').config();

const credentials = process.env.PATH_TO_PEM;

mongoose.connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: process.env.DB_NAME,
});

const db = mongoose.connection;

let gfs;

db.on('disconnected', () => {
    console.log('Mongoose default connection disconnected');
});

db.on("error", (error) => {
    console.error("MongoDB connection error:", error);
});

db.once("open", () => {
    gfs = new mongoose.mongo.GridFSBucket(db.db, {
        bucketName: 'posts'
    })
    console.log("Connected to MongoDB");
});

module.exports = db;