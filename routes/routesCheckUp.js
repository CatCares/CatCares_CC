const express = require("express");
const getFile = require("../utils/getFile");
const authMiddleware = require("../auth/jwtProvider");
const Kucing = require("../models/kucing");
const CheckUp = require("../models/checkup");
const Dokter = require("../models/dokter");
const mongoose = require("mongoose");
const { checkUpStatus } = require("../constant");

const router = express.Router();

router.post("/check-doctor", authMiddleware, async (req, res) => {
  try {
    const {
      userId,
      body: { kucingId, tanggal, jam, notes, category },
    } = req;

    const cat = await Kucing.findOne({
      _id: new mongoose.Types.ObjectId(kucingId),
      userId: new mongoose.Types.ObjectId(userId),
    });

    if (!cat) {
      throw {
        status: 404,
        message: "Kucing tidak ditemukan",
      };
    }

    const newCheckup = await CheckUp.create({
      userId: new mongoose.Types.ObjectId(userId),
      kucingId: cat._id,
      category,
      jam,
      notes,
      tanggal,
      status: checkUpStatus.draft,
    });

    if (!newCheckup) {
      throw {
        status: 500,
        message: "Internal server error",
      };
    }

    const doctorList = await Dokter.find({ category });

    const doctorData = await Promise.all(
      doctorList.map(async (doc) => {
        const docPhoto = await getFile(doc.foto);

        return {
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

    return res.status(201).json({
      data: {
        listDoctor: doctorData,
        checkupId: newCheckup._id,
      },
    });
  } catch (error) {
    if (!error.status) {
      return res.status(500).json({ error: "Internal server error" });
    }
    return res.status(error.status).json({ error: error.message });
  }
});

router.get("/list-checkup", authMiddleware, async (req, res) => {
  try {
    const { userId } = req;

    const checkUpList = await CheckUp.aggregate([
      {
        $lookup: {
          from: "kucings",
          localField: "kucingId",
          foreignField: "_id",
          as: "kucing",
        },
      },
      {
        $unwind: "$kucing",
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          status: checkUpStatus.active,
        },
      },
    ]).exec();

    const checkupData = await Promise.all(
      checkUpList.map(async (c) => {
        const cat = c.kucing;
        const user = c.user;

        const catPhoto = await getFile(cat.foto);

        const kucingData = {
          kucingId: cat._id,
          nama: cat.nama,
          umur: cat.umur,
          berat: cat.berat,
          ras: cat.ras,
          kelamin: cat.kelamin,
          warna: cat.warna,
          foto: catPhoto,
          createdAt: cat.createdAt,
          updatedAt: cat.updatedAt,
        };

        const userData = {
          userId: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          noHP: user.noHP,
          alamat: user.alamat,
          foto: user.foto ? await getFile(user.foto) : "",
        };

        if (c.dokterId) {
          const dokter = await Dokter.findById(c.dokterId);

          const docPhoto = await getFile(dokter.foto);

          const dokterData = {
            nama: dokter.nama,
            alamat: dokter.alamat,
            email: dokter.email,
            telepon: dokter.telepon,
            foto: docPhoto,
            tipe: dokter.tipe,
            createdAt: dokter.createdAt,
            updatedAt: dokter.updatedAt,
          };

          return {
            checkupId: c._id,
            tanggal: c.tanggal,
            jam: c.jam,
            notes: c.notes,
            status: c.status,
            cateogry: c.category,
            user: userData,
            kucing: kucingData,
            dokter: dokterData,
            createdAt: c.createdAt,
            updatedAt: c.updatedAt,
          };
        }

        return {
          checkupId: c._id,
          tanggal: c.tanggal,
          jam: c.jam,
          notes: c.notes,
          status: c.status,
          cateogry: c.category,
          user: userData,
          kucing: kucingData,
          createdAt: c.createdAt,
          updatedAt: c.updatedAt,
        };
      })
    );

    return res.status(200).json({
      data: checkupData,
      message: "Get list checkup success",
    });
  } catch (error) {
    console.log(error);
    if (!error.status) {
      return res.status(500).json({ error: "Internal server error" });
    }
    return res.status(error.status).json({ error: error.message });
  }
});

router.get("/detail-checkup/:checkupId", authMiddleware, async (req, res) => {
  try {
    const checkUpList = await CheckUp.aggregate([
      {
        $lookup: {
          from: "kucings",
          localField: "kucingId",
          foreignField: "_id",
          as: "kucing",
        },
      },
      {
        $unwind: "$kucing",
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.params.checkupId),
        },
      },
    ]).exec();

    const checkupData = await Promise.all(
      checkUpList.map(async (c) => {
        const cat = c.kucing;
        const user = c.user;

        const catPhoto = await getFile(cat.foto);

        const kucingData = {
          kucingId: cat._id,
          nama: cat.nama,
          umur: cat.umur,
          berat: cat.berat,
          ras: cat.ras,
          kelamin: cat.kelamin,
          warna: cat.warna,
          foto: catPhoto,
          createdAt: cat.createdAt,
          updatedAt: cat.updatedAt,
        };

        const userData = {
          userId: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          noHP: user.noHP,
          alamat: user.alamat,
          foto: user.foto ? await getFile(user.foto) : "",
        };

        if (c.dokterId) {
          const dokter = await Dokter.findById(c.dokterId);

          const docPhoto = await getFile(dokter.foto);

          const dokterData = {
            nama: dokter.nama,
            alamat: dokter.alamat,
            email: dokter.email,
            telepon: dokter.telepon,
            foto: docPhoto,
            tipe: dokter.tipe,
            createdAt: dokter.createdAt,
            updatedAt: dokter.updatedAt,
          };

          return {
            checkupId: c._id,
            tanggal: c.tanggal,
            jam: c.jam,
            notes: c.notes,
            status: c.status,
            cateogry: c.category,
            user: userData,
            kucing: kucingData,
            dokter: dokterData,
            createdAt: c.createdAt,
            updatedAt: c.updatedAt,
          };
        }

        return {
          checkupId: c._id,
          tanggal: c.tanggal,
          jam: c.jam,
          notes: c.notes,
          status: c.status,
          cateogry: c.category,
          user: userData,
          kucing: kucingData,
          createdAt: c.createdAt,
          updatedAt: c.updatedAt,
        };
      })
    );

    return res.status(200).json({
      data: checkupData[0],
      message: "Get list checkup success",
    });
  } catch (error) {
    if (!error.status) {
      return res.status(500).json({ error: "Internal server error" });
    }
    return res.status(error.status).json({ error: error.message });
  }
});

router.put("/doctor-checkup/:checkupId", authMiddleware, async (req, res) => {
  try {
    const {
      body: { dokterId },
    } = req;

    const dokterDoc = await Dokter.findById(dokterId);

    if (!dokterDoc) {
      throw {
        status: 404,
        message: "Dokter tidak ditemukan",
      };
    }

    const checkupDoc = await CheckUp.findByIdAndUpdate(req.params.checkupId, {
      dokterId: new mongoose.Types.ObjectId(dokterId),
      status: checkUpStatus.active,
    });

    if (!checkupDoc) {
      throw {
        status: 404,
        message: "Checkup tidak ditemukan",
      };
    }

    return res.status(200).json({
      message: "Checkup berhasil dibuat",
    });
  } catch (error) {
    if (!error.status) {
      return res.status(500).json({ error: "Internal server error" });
    }
    return res.status(error.status).json({ error: error.message });
  }
});

module.exports = router;
