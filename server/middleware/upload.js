const multer = require('multer');
const {GridFsStorage} = require('multer-gridfs-storage');
require('dotenv').config();

const credentials = process.env.PATH_TO_PEM

const storage = new GridFsStorage({
    url: process.env.DB_CONNECTION,
    options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: "Postcard"
    },
    file: (req, file) => {
        const match = ["image/png", "image/jpeg", "image/jpg"];

        if (match.indexOf(file.mimetype) === -1) {
            console.log('file.mimetype === -1')
            return `${Date.now()}-jf-${file.originalname}`;
        }
        console.log('store');
        return {
            bucketName: 'posts',
            filename: `${Date.now()}-id-${file.originalname}`,
        };
    },
});

module.exports = multer({storage});

