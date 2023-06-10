const Dokter = require('../models/dokter');

// List Dokter
const getAllDokter = async (req, res) => {
    try {
        const dokter = await Dokter.find({});
        res.json(dokter);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
  
// Detail Dokter
const getDokterById = async (req, res) => {
    try {
        const dokter = await Dokter.findById(req.params.id);
        res.json(dokter);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
  
// Tambah dokter
const createDokter = async (req, res) => {
  try {
    const { nama, umur, telepon, email, alamat } = req.body;
    const dokter = new Dokter({ nama, umur, telepon, email, alamat });
    await dokter.save();
    res.json(dokter);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
  
// Update Dokter
const updateDokter = async (req, res) => {
  try {
    const updatedDokter = await Dokter.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedDokter) {
      return res.status(404).json({ message: 'Dokter tidak ditemukan' });
    }
    res.json(updatedDokter);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
  
// Delete dokter
const deleteDokter = (req, res) => {
    Dokter.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ message: 'Dokter berhasil dihapus' });
        }
    });
};
  
  module.exports = {
    getAllDokter,
    getDokterById,
    createDokter,
    updateDokter,
    deleteDokter,
  };