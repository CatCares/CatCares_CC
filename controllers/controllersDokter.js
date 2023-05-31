const Dokter = require('../models/dokter');

// List Dokter
const getAllDokter = (req, res) => {
    Dokter.find({}, (err, dokter) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(dokter);
        }
    });
};
  
// Detail Dokter
const getDokterById = (req, res) => {
    Dokter.findById(req.params.id, (err, dokter) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(dokter);
        }
    });
};
  
// Tambah dokter
const createDokter = (req, res) => {
    const { nama, umur, telepon, email, alamat } = req.body;
    const dokter = new Dokter({ nama, umur, telepon, email, alamat });
    dokter.save((err) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(dokter);
        }
    });
};
  
// Update Dokter
const updateDokter = (req, res) => {
    Dokter.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true },
        (err, dokter) => {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json(dokter);
            }
        }
    );
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