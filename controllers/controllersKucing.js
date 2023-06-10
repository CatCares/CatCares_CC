const Kucing = require('../models/kucing');
const FormData = require('form-data');

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
const createKucing = async (req, res) => {
  try {
    const { nama, umur, berat, ras, kelamin, warna } = req.body;
    const foto = req.file ? req.file.path : '';

    const kucing = new Kucing({ nama, umur, berat, ras, kelamin, warna, foto });
    await kucing.save();

    // Membuat objek FormData
    const formData = new FormData();
    formData.append('nama', nama);
    formData.append('umur', umur);
    formData.append('berat', berat);
    formData.append('ras', ras);
    formData.append('kelamin', kelamin);
    formData.append('warna', warna);
    formData.append('foto', fs.createReadStream(foto)); // Mengunggah file foto ke FormData

    res.set('Content-Type', 'multipart/form-data'); // Mengatur header Content-Type menjadi multipart/form-data
    res.status(201).send(formData); // Mengirimkan FormData sebagai respons
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

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