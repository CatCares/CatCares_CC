const Bucket = require("../config/bucketConfig");

const getFile = async (fileName) => {
    const [url] = await Bucket.file(fileName).getSignedUrl({
        version: "v4",
        action: "read",
        expires: Date.now() + 1000 * 60 * 60,
    });

    return url;
};

module.exports = getFile;