const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://atalie:1234@catcares.jkv04p8.mongodb.net/catcares', {
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