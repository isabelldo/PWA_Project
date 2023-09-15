/**
 * Specification for storing and retrieving files that exceed the BSON-document size limit of 16 MB.
 * Provides storing files larger than 16 MB in MongoDb.
 * This is used for POST-Requests to store pictures -> see upload.routes.js
 */
import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";
import dotenv from "dotenv";

dotenv.config();

const credentials = process.env.PATH_TO_PEM;

const storage = new GridFsStorage({
  //db: connection,
  url: process.env.DB_CONNECTION,
  options: {
    tlsCertificateKeyFile: credentials, // nur falls ein Zertifikat zur Autorisierung
    tlsCertificateKeyFilePassword: credentials, // für MongoDB Atlas verwendet wird
    dbName: process.env.DB_NAME,
  },
  file: (req, file) => {
    const match = ["image/png", "image/jpeg", "image/jpg"];

    if (match.indexOf(file.mimetype) === -1) {
      console.log("file.mimetype === -1");
      return `${Date.now()}-id-${file.originalname}`;
    }
    console.log("store");
    return {
      bucketName: "posts",
      filename: `${Date.now()}-id-${file.originalname}`,
    };
  },
});

export default multer({ storage });
