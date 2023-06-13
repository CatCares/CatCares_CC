const mongoose = require('mongoose');

const dokterSchema = new mongoose.Schema(
  {
    nama: { type: String, required: true },
    telepon: { type: String, required: true },
    email: { type: String, required: true },
    alamat: { type: String, required: true },
    foto: { type: String, required: true },
    tipe: { type: String, required: true },
    category: { type: String, required: true }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Dokter', dokterSchema);