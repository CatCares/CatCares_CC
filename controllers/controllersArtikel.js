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