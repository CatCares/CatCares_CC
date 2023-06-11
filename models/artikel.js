const mongoose = require('mongoose');

const artikelSchema = new mongoose.Schema(
  {
    judul: { type: String },
    konten: { type: String },
    link: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Artikel', artikelSchema);