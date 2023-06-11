const Kucing = require('../models/kucing');

// List Kucing
const getAllKucing = (req, res) => {
    Kucing.find()
      .then((kucing) => {
        res.json(kucing);
      })
      .catch((error) => {
        res.status(500).json({ error: error.message });
      });
};

// Detail Kucing berdasarkan ID
const getKucingById = (req, res) => {
    Kucing.findById(req.params.id)
      .exec()
      .then((kucing) => {
        if (!kucing) {
          return res.status(404).json({ error: 'Kucing not found' });
        }
        res.json(kucing);
      })
      .catch((error) => {
        res.status(500).json({ error: error.message });
      });
  };    

// Tambah Kucing
async function createKucing(req, res) {
  const { foto, nama, ras, kelamin, umur, berat, warna } = req.body;
  try {
    const kucing = await Kucing.create({ foto, nama, ras, kelamin, umur, berat, warna });
    res.status(201).json(kucing);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Update Kucing
const updateKucing = async (req, res) => {
    try {
      const kucing = await Kucing.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!kucing) {
        return res.status(404).json({ error: 'Kucing not found' });
      }
      res.json(kucing);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };     

// Delete Kucing
const deleteKucing = async (req, res) => {
    try {
      const deletedKucing = await Kucing.findByIdAndDelete(req.params.id);
      if (!deletedKucing) {
        return res.status(404).json({ message: 'Kucing tidak ditemukan' });
      }
      res.json({ message: 'Kucing berhasil dihapus' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };    

module.exports = {
    getAllKucing,
    getKucingById,
    createKucing,
    updateKucing,
    deleteKucing,
};