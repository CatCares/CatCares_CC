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

    const data = await Promise.all(
      artikel.map(async (art) => {
        const artPhoto = await getFile(art.foto);

        return {
          artikelId: art._id,
          judul: art.judul,
          konten: art.konten,
          link: art.link,
          foto: artPhoto,
          createdAt: art.createdAt,
          updatedAt: art.updatedAt,
        };
      })
    );

    return res.status(200).json({
      data,
      message: "Get list artikel success",
    });
  } catch (err) {
    if (!error.status) {
      return res.status(500).json({ error: "Internal server error" });
    }
    return res.status(error.status).json({ error: error.message });
  }
};

// Detail artikel
const getArtikelById = async (req, res) => {
  try {
    const artikel = await Artikel.findById(req.params.artikelId);

    if (!artikel) {
      throw {
        status: 404,
        message: "Artikel tidak ditemukan",
      };
    }

    const artPhoto = await getFile(artikel.foto);

    const data = {
      judul: artikel.judul,
      konten: artikel.konten,
      link: artikel.link,
      foto: artPhoto,
      createdAt: artikel.createdAt,
      updatedAt: artikel.updatedAt,
    };

    return res.status(200).json({
      data,
      message: "detail artikel success",
    });
  } catch (err) {
    if (!err.status) {
      return res.status(500).json({ error: "Internal server error" });
    }
    return res.status(err.status).json({ error: err.message });
  }
};

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