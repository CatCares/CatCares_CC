const Kucing = require("../models/kucing");
const { Storage } = require("@google-cloud/storage");
const storage = new Storage({
  keyFilename: "../credentials.json",
});

const uploadFile = require("../utils/fileUploader");
const getFile = require("../utils/getFile");
const mongoose = require('mongoose')

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
        return res.status(404).json({ error: "Kucing not found" });
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
    const bucketName = "cat-cares";

    const { nama, ras, kelamin, umur, berat, warna } = req.body;
    const foto = req.file;

    const originalFileName = foto.originalname;
    const originalFileExtension = originalFileName.split(".").pop();
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
    const bucketName = "cat-cares";

    const { nama, ras, kelamin, umur, berat, warna, foto } = req.body;

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

    res.json({ message: "Kucing berhasil diperbarui" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Kucing
const deleteKucing = async (req, res) => {
  try {
    const deletedKucing = await Kucing.findByIdAndDelete(req.params.kucingId);
    if (!deletedKucing) {
      return res.status(404).json({ message: "Kucing tidak ditemukan" });
    }
    res.json({ message: "Kucing berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const registerUserCat = async (req,res) => {
  try {
    const userId = req.userId
    const { nama, ras, kelamin, umur, berat, warna } = req.body;
    const file = req.file

    if(!file){
      throw {
        status: 400,
        message: "Gambar kucing tidak boleh kosong"
      }
    }

    const fileUploaded = await uploadFile(file)

    const newCatto = await Kucing.create({
      nama,
      ras,
      kelamin,
      umur,
      berat,
      warna,
      foto: fileUploaded.file,
      userId
    })

    if(!newCatto){
      throw {
        status: 500,
        message: "Internal server error"
      }
    }

    return res.status(201).json({
      data: {
        kucingId: newCatto._id
      },
      message: "Kucing berhasil dibuat"
    })

  } catch (error) {
    if (!error.status) {
      return res.status(500).json({ error: "Internal server error" });
    }
    return res.status(error.status).json({ error: error.message });
  }
}

const getUserCat = async (req,res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId)

    const usersCat = await Kucing.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $match: {
          userId: userId
        },
      },
    ]).exec()

    const data = await Promise.all(
      usersCat.map(async (cat) => {
        const catPhoto = await getFile(cat.foto)

        return {
          kucingId: cat._id,
          nama: cat.nama,
          umur: cat.umur,
          berat: cat.berat,
          ras: cat.ras,
          kelamin: cat.kelamin,
          warna: cat.warna,
          foto: catPhoto,
          pemilik: {
            userId: cat.userId,
            name: `${cat.user.firstName} ${cat.user.lastName}`,
            foto: cat.user.foto ? await getFile(cat.user.foto) : ""
          },
          createdAt: cat.createdAt,
          updatedAt: cat.updatedAt
        }
      })
    )

    return res.status(200).json({
      data,
      message: "Get kucing user success"
    })

  } catch (error) {
    if (!error.status) {
      return res.status(500).json({ error: "Internal server error" });
    }
    return res.status(error.status).json({ error: error.message });
  }
}

const getUserCatDetail = async (req,res) => {
  try {
    const kucingId = new mongoose.Types.ObjectId(req.params.kucingId)
    const userId = new mongoose.Types.ObjectId(req.userId)

    const usersCat = await Kucing.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $match: {
          userId: userId,
          _id: kucingId
        },
      },
    ]).exec()

    const data = await Promise.all(
      usersCat.map(async (cat) => {
        const catPhoto = await getFile(cat.foto)

        return {
          kucingId: cat._id,
          nama: cat.nama,
          umur: cat.umur,
          berat: cat.berat,
          ras: cat.ras,
          kelamin: cat.kelamin,
          warna: cat.warna,
          foto: catPhoto,
          pemilik: {
            userId: cat.userId,
            name: `${cat.user.firstName} ${cat.user.lastName}`,
            foto: cat.user.foto ? await getFile(cat.user.foto) : ""
          },
          createdAt: cat.createdAt,
          updatedAt: cat.updatedAt
        }
      })
    )

    return res.status(200).json({
      data: data[0],
      message: "Get kucing user success"
    })

  } catch (error) {
    if (!error.status) {
      return res.status(500).json({ error: "Internal server error" });
    }
    return res.status(error.status).json({ error: error.message });
  }
}

module.exports = {
  getAllKucing,
  getKucingById,
  createKucing,
  updateKucing,
  deleteKucing,
  registerUserCat,
  getUserCat,
  getUserCatDetail
};
