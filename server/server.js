const express = require('express');
const postsRoutes = require('./routes/post.routes');
const cors = require('cors');
const uploadRoutes = require('./routes/upload.routes');
const downloadRoutes = require('./routes/download.routes');
const deleteRoutes = require('./routes/delete.routes');

const app = express();
const PORT = 3000;

app.use(express.json());
// enable cors for all requests
app.use(cors());
app.use('/posts', postsRoutes);
app.use("/upload", uploadRoutes);
app.use("/download", downloadRoutes);
app.use("/delete", deleteRoutes);

app.listen(PORT, (error) => {
    if (error) {
        console.log(error);
    } else {
        console.log(`server running on http://localhost:${PORT}`);
    }
});
