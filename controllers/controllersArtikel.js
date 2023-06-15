const Artikel = require('../models/artikel');
const { Storage } = require("@google-cloud/storage");
const storage = new Storage({
  keyFilename: "../credentials.json",
});

const uploadFile = require("../utils/fileUploader");
const getFile = require("../utils/getFile");

// List Artikel
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
  try {
    const { judul, konten, link } = req.body;
    const file = req.file;

    if (!file) {
      throw {
        status: 400,
        message: "Gambar artikel tidak boleh kosong",
      };
    }
    
    const fileUploaded = await uploadFile(file);
    const newArtikel = await Artikel.create({
      judul,
      konten,
      link,
      foto: fileUploaded.file,
    });

    if (!newArtikel) {
      throw {
        status: 500,
        message: "Internal server error",
      };
    }

    return res.status(201).json({
      data: {
        artikelId: newArtikel._id,
      },
      message: "Artikel berhasil dibuat",
    });
  } catch (error) {
    if (!error.status) {
      return res.status(500).json({ error: "Internal server error" });
    }
    return res.status(error.status).json({ error: error.message });
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