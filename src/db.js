const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://atalie:1234@ac-wfcic6a-shard-00-00.jkv04p8.mongodb.net:27017,ac-wfcic6a-shard-00-01.jkv04p8.mongodb.net:27017,ac-wfcic6a-shard-00-02.jkv04p8.mongodb.net:27017/catcares?ssl=true&replicaSet=atlas-umy5b2-shard-0&authSource=admin&retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Database terhubung');
    } catch (error) {
        console.error('Koneksi database gagal', error);
        process.exit(1);
    }
};

module.exports = connectDB;