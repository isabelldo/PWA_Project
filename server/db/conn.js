import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const credentials = process.env.PATH_TO_PEM;

mongoose.connect(process.env.DB_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  tls: true,
  tlsCertificateKeyFile: credentials,
  tlsCertificateKeyFilePassword: credentials,
  dbName: process.env.DB_NAME,
});

const db = mongoose.connection;

db.on("error", (error) => {
  console.error("MongoDB connection error:", error);
});

db.once("open", () => {
  console.log("Connected to MongoDB");
});

export default db;
