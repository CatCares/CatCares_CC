const mongoose = require("mongoose");

const checkUpSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
    dokterId: { type: mongoose.Types.ObjectId, required: false, ref: "Dokter" },
    kucingId: { type: mongoose.Types.ObjectId, required: true, ref: "Kucing" },
    tanggal: { type: Date, required: true },
    jam: { type: String },
    notes: { type: String },
    status: { type: String },
    category: { type: String },
  },
  {
    timestamp: true,
  }
);

module.exports = mongoose.model("Checkup", checkUpSchema);
