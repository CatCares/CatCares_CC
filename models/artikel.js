const mongoose = require('mongoose');

const artikelSchema = new mongoose.Schema({
  judul: { type: String, required: true },
  konten: { type: String, required: true },
  penulis: { type: String, required: true },
});

module.exports = mongoose.model('Artikel', artikelSchema);