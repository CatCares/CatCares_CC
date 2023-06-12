const Kucing = require('../models/kucing');
const { Storage } = require('@google-cloud/storage');
const storage = new Storage({
  keyFilename: '../credentials.json',
});

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
    const bucketName = 'cat-cares';

    const { nama, ras, kelamin, umur, berat, warna } = req.body;
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
    const kucing = new Kucing({
      nama,
      ras,
      kelamin,
      umur,
      berat,
      warna,
      foto: publicUrl,
    });

    await kucing.save();

    res.json(kucing);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Kucing
const updateKucing = async (req, res) => {
  try {
    const bucketName = 'cat-cares';

    const { nama, ras, kelamin, umur, berat, warna, foto } = req.body;

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

      // Update kucing dengan foto baru
      await Kucing.findByIdAndUpdate(req.params.id, {
        nama,
        ras,
        kelamin,
        umur,
        berat,
        warna,
        foto: publicUrl,
      });
    } else {
      // Update kucing tanpa mengubah foto
      await Kucing.findByIdAndUpdate(req.params.id, {
        nama,
        ras,
        kelamin,
        umur,
        berat,
        warna,
      });
    }

    res.json({ message: 'Kucing berhasil diperbarui' });
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