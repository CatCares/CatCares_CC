const {Storage} = require("@google-cloud/storage");
const path = require("path");

const serviceKey = path.join(__dirname, "../keys.json");

const storage = new Storage({
    keyFilename: serviceKey,
    projectId: "catcares",
});

const Bucket = storage.bucket("catcares-asset");

module.exports = Bucket;