const multer = require('multer');
const path = require('path');

const storage = (p) => multer.diskStorage({
    destination: function (req, file, cb) {
        let join = path.join(__dirname, `../../public/images/${p}`);
        cb(null, join);
    },
    filename: (req, file, cb) => {
        if (file.originalname.match(/\.(png|jpg|jpeg)/) || file.originalname.match(/\.(JPG|PNG|JPEG)$/)) {
            const split = file.originalname.split('.').length;
            const fileType = file.originalname.split('.')[split - 1];
            let filename = `${Date.now()}.${fileType}`;
            req.fileName = filename;
            cb(null, filename);
        } else {
            cb(null, null);
        }
    }
})

module.exports = (p) => multer({ storage: storage(p) });