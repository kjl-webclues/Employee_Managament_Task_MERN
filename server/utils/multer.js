const multer = require('multer');
const path = require('path');

//Multer Config
module.exports = multer({
    storage: multer.diskStorage({
        //add back the extention
        filename: function (req, file, cb) {
            cb(null, Date.now() + path.extname(file.originalname))
    },}),

    limits: {
      fieldNameSize: 200,
        fileSize: 1024 * 1024 * 3,
    },
    
    //fileFilter to filter file which u want to alow
    fileFilter: (req, file, cb) => {
        let ext = path.extname(file.originalname);
        if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png" && ext !== ".txt" && ext !== ".doc" && ext !== ".pdf" && ext !== ".docx" && ext !== ".gif" && ext !== ".xml") {
            cb(new Error("File type is not supported"), false);
            return;
        }
        cb(null, true);
    },
});
