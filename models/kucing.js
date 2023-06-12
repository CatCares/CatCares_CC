const mongoose = require('mongoose');

const kucingSchema = new mongoose.Schema(
  {
    nama: { type: String, required: true },
    umur: { type: Number, required: true },
    berat: { type: Number, required: true },
    ras: { type: String, required: true },
    kelamin: { type: String, required: true },
    warna: { type: String, required: true },
    foto: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Kucing', kucingSchema);