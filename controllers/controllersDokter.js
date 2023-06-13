// const FormData = require('form-data');
const Dokter = require("../models/dokter");
const { Storage } = require("@google-cloud/storage");
const storage = new Storage({
  keyFilename: "../credentials.json",
});

const uploadFile = require("../utils/fileUploader");
const getFile = require("../utils/getFile");
const constants = require("../constant");

// List Dokter
const getAllDokter = async (req, res) => {
  try {
    const dokter = await Dokter.find({});

    const data = await Promise.all(
      dokter.map(async (doc) => {
        const docPhoto = await getFile(doc.foto);

        return {
          dokterId: doc._id,
          nama: doc.nama,
          alamat: doc.alamat,
          email: doc.email,
          telepon: doc.telepon,
          foto: docPhoto,
          tipe: doc.tipe,
          createdAt: doc.createdAt,
          updatedAt: doc.updatedAt,
        };
      })
    );

    return res.status(200).json({
      data,
      message: "Get list dokter success",
    });
  } catch (err) {
    if (!error.status) {
      return res.status(500).json({ error: "Internal server error" });
    }
    return res.status(error.status).json({ error: error.message });
  }
};

// Detail Dokter
const getDokterById = async (req, res) => {
  try {
    const dokter = await Dokter.findById(req.params.dokterId);

    if (!dokter) {
      throw {
        status: 404,
        message: "Dokter tidak ditemukan",
      };
    }

    const docPhoto = await getFile(dokter.foto);

    const data = {
      nama: dokter.nama,
      alamat: dokter.alamat,
      email: dokter.email,
      telepon: dokter.telepon,
      foto: docPhoto,
      tipe: dokter.tipe,
      createdAt: dokter.createdAt,
      updatedAt: dokter.updatedAt,
    };

    return res.status(200).json({
      data,
      message: "detail dokter success",
    });
  } catch (err) {
    if (!err.status) {
      return res.status(500).json({ error: "Internal server error" });
    }
    return res.status(err.status).json({ error: err.message });
  }
};

// Tambah dokter
const createDokter = async (req, res) => {
  try {
    const { nama, telepon, email, alamat, tipe } = req.body;
    const file = req.file;

    if (!file) {
      throw {
        status: 400,
        message: "Gambar dokter tidak boleh kosong",
      };
    }

    const doctorTypes = constants.doctorTypes;
    const tipeDokter = doctorTypes.find((obj) => obj.value === tipe);
    
    if(!tipeDokter){
      throw {
        status: 400,
        message: "Tipe tidak valid"
      }
    }
    
    const fileUploaded = await uploadFile(file);
    const newDokter = await Dokter.create({
      nama,
      telepon,
      email,
      alamat,
      foto: fileUploaded.file,
      tipe: tipeDokter.label,
      category: tipeDokter.value
    });

    if (!newDokter) {
      throw {
        status: 500,
        message: "Internal server error",
      };
    }

    return res.status(201).json({
      data: {
        dokterId: newDokter._id,
      },
      message: "Dokter berhasil dibuat",
    });
  } catch (error) {
    if (!error.status) {
      return res.status(500).json({ error: "Internal server error" });
    }
    return res.status(error.status).json({ error: error.message });
  }
};

// Update Dokter
const updateDokter = async (req, res) => {
  try {
    const bucketName = "cat-cares";

    const { nama, telepon, email, alamat } = req.body;
    const foto = req.file;

    // Jika ada foto baru di-upload
    if (foto) {
      const originalFileName = foto.originalname;
      const originalFileExtension = originalFileName.split(".").pop();
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

    res.json({ message: "Dokter berhasil diperbarui" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete dokter
const deleteDokter = async (req, res) => {
  try {
    const dokter = await Dokter.findOneAndDelete({ _id: req.params.id });
    if (!dokter) {
      return res.status(404).json({ message: "Dokter not found" });
    }
    res.json({ message: "Dokter berhasil dihapus" });
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
