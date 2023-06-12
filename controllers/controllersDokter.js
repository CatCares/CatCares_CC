// const FormData = require('form-data');
const Dokter = require('../models/dokter');
const { Storage } = require('@google-cloud/storage');
const storage = new Storage({
  keyFilename: '../credentials.json',
});

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
    const bucketName = 'cat-cares';

    const { nama, telepon, email, alamat } = req.body;
    const foto = req.file;

    const originalFileName = foto.originalname;
    const originalFileExtension = originalFileName.split('.').pop();
    const fileName = `${Date.now()}.${originalFileExtension}`;

    // Upload the photo to Google Cloud Storage
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(fileName);
    const stream = file.createWriteStream({
      resumable: false,
      gzip: true,
      metadata: {
      contentType: foto.mimetype,
      },
    });
    stream.end(foto.buffer);

    // Save the public URL of the photo in MongoDB
    const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;
    const dokter = new Dokter({
      nama,
      telepon,
      email,
      alamat,
      foto: publicUrl,
    });

    await dokter.save();

    res.json(dokter);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


  
// Update Dokter
const updateDokter = async (req, res) => {
  try {
    const bucketName = 'cat-cares';

    const { nama, telepon, email, alamat } = req.body;
    const foto = req.file;

    // Jika ada foto baru di-upload
    if (foto) {
      const originalFileName = foto.originalname;
      const originalFileExtension = originalFileName.split('.').pop();
      const fileName = `${Date.now()}.${originalFileExtension}`;

      // Upload foto baru ke Google Cloud Storage
      const bucket = storage.bucket(bucketName);
      const file = bucket.file(fileName);
      const stream = file.createWriteStream({
        resumable: false,
        gzip: true,
        metadata: {
          contentType: foto.mimetype,
        },
      });
      stream.end(foto.buffer);

      // Simpan URL publik foto baru di MongoDB
      const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;

      // Update dokter dengan foto baru
      await Dokter.findByIdAndUpdate(req.params.id, {
        nama,
        telepon,
        email,
        alamat,
        foto: publicUrl,
      });
    } else {
      // Update dokter tanpa mengubah foto
      await Dokter.findByIdAndUpdate(req.params.id, {
        nama,
        telepon,
        email,
        alamat,
      });
    }

    res.json({ message: 'Dokter berhasil diperbarui' });
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