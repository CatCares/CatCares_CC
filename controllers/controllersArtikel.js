const Artikel = require('../models/artikel');

// List artikel
const getAllArtikel = async (req, res) => {
    try {
      const artikel = await Artikel.find({});
      res.json(artikel);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };  

// Detail artikel
function getArtikelById(req, res) {
    const { id } = req.params;
    Artikel.findById(id)
      .then(artikel => {
        if (!artikel) {
          return res.status(404).json({ error: 'Artikel not found' });
        }
        res.json(artikel);
      })
      .catch(error => {
        res.status(500).json({ error: 'Internal server error' });
      });
  }     

// Tambah artikel
const createArtikel = async (req, res) => {
    const { judul, konten, link } = req.body;
    const artikel = new Artikel({ judul, konten, link });
    try {
      await artikel.save();
      res.json(artikel);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
}; 

// Update artikel
const updateArtikel = async (req, res) => {
  try {
      const artikel = await Artikel.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(artikel);
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
};

// Delete artikel
const deleteArtikel = async (req, res) => {
  try {
      await Artikel.findByIdAndRemove(req.params.id);
      res.json({ message: 'Artikel berhasil dihapus' });
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
};

module.exports = {
    getAllArtikel,
    getArtikelById,
    createArtikel,
    updateArtikel,
    deleteArtikel,
};