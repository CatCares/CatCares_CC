const mimetypes = require('mimetypes');
const Bucket = require('../config/bucketConfig');

const uploadFile = async (file) => {
    const gcsFileName = Date.now() + "_" + file.originalname;
    const upload = Bucket.file(gcsFileName);

    return await upload
        .save(file.buffer, {
            metadata: {contentType: file.mimetype},
            validation: "md5",
        })
        .then(() => {
            return {
                error: false,
                detail: {},
                file: gcsFileName,
            }
        })
        .catch((err) => {
            console.log(err)
            return {
                error: true,
                detail: err,
                file: "",
            }
        })
}

module.exports = uploadFile;