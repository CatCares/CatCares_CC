const mongoose = require('mongoose');

const dokterSchema = new mongoose.Schema({
  nama: { type: String, required: true },
  umur: { type: Number, required: true },
  telepon: { type: String, required: true },
  email: { type: String, required: true },
  alamat: { type: String, required: true },
});

module.exports = mongoose.model('Dokter', dokterSchema);