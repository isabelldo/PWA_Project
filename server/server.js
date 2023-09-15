import express from "express";
import postsRoutes from "./routes/post.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import downloadRoutes from "./routes/download.routes.js";
// import deleteRoutes from "./routes/delete.routes";
import cors from "cors";

const app = express();
const PORT = 3000;

app.use(express.json());
// enable cors for all requests
app.use(cors());
app.use("/posts", postsRoutes);
app.use("/upload", uploadRoutes);
app.use("/download", downloadRoutes);
// app.use("/delete", deleteRoutes);

app.listen(PORT, (error) => {
  if (error) {
    console.log(error);
  } else {
    console.log(`server running on http://localhost:${PORT}`);
  }
});
