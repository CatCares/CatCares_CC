const Artikel = require('../models/artikel');

// List artikel
const getAllArtikel = (req, res) => {
    Artikel.find({}, (err, artikel) => {
        if (err) {
          res.status(500).json({ error: err.message });
        } else {
          res.json(artikel);
        }
      });
}

// Detail artikel
const getArtikelById = (req, res) => {
    Artikel.findById(req.params.id, (err, artikel) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(artikel);
        }
    });
};

// Tambah artikel
const createArtikel = (req, res) => {
    const { judul, konten, penulis } = req.body;
    const artikel = new Artikel({ judul, konten, penulis });
    artikel.save((err) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(artikel);
        }
    });
};

// Update artikel
const updateArtikel = (req, res) => {
    Artikel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true },
        (err, artikel) => {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json(artikel);
            }
        }
    );
};

// Delete artikel
const deleteArtikel = (req, res) => {
    Artikel.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
          res.status(500).json({ error: err.message });
        } else {
          res.json({ message: 'Artikel berhasil dihapus' });
        }
    });
};

module.exports = {
    getAllArtikel,
    getArtikelById,
    createArtikel,
    updateArtikel,
    deleteArtikel,
};