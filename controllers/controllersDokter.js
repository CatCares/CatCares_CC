const FormData = require('form-data');
const axios = require('axios');
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

    // Access the uploaded image file from the 'foto' field
    const foto = req.file;

    // Create a new instance of FormData
    const formData = new FormData();
    formData.append('nama', nama);
    formData.append('umur', umur);
    formData.append('telepon', telepon);
    formData.append('email', email);
    formData.append('alamat', alamat);
    formData.append('foto', foto.buffer, foto.originalname);

    // Make a request to the server with the FormData
    const response = await fetch('/', {
      method: 'POST',
      body: formData,
      headers: {
          "Content-Type": "multipart/form-data"
      }
    });

    // Parse the response as JSON
    const dokter = await response.json();

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
const deleteDokter = async (req, res) => {
  try {
    const dokter = await Dokter.findOneAndDelete({ _id: req.params.id });
    if (!dokter) {
      return res.status(404).json({ message: 'Dokter not found' });
    }
    res.json({ message: 'Dokter berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
  
  module.exports = {
    getAllDokter,
    getDokterById,
    createDokter,
    updateDokter,
    deleteDokter,
  };