const mongoose = require('mongoose');

const artikelSchema = new mongoose.Schema(
  {
    judul: { type: String, required: true },
    konten: { type: String, required: true },
    link: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Artikel', artikelSchema);