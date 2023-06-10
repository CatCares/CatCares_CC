const mongoose = require('mongoose');

const artikelSchema = new mongoose.Schema({
  link: { type: String, required: true },
});

module.exports = mongoose.model('Artikel', artikelSchema);