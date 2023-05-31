const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/nama_database', {
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