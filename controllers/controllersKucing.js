const kucing = require('../models/kucing');
const Kucing = require('../models/kucing')

// List Kucing
const getAllKucing = (req, res) => {
    Kucing.find({}, (err, kucing) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(kucing);
        }
    });
};

// Detail Kucing berdasarkan ID
const getKucingById = (req, res) => {
    Kucing.findById(req.params.id, (err, kucing) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(kucing);
        }
    });
};

// Tambah Kucing
const createKucing = (req, res) => {
    const kucing = new Kucing(req.body);
    kucing.save((err) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(kucing);
        }
    });
};

// Update Kucing
const updateKucing = (req, res) => {
    Kucing.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true },
        (err, kucing) => {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json(kucing);
            }
        }
    );
};

// Delete Kucing
const deleteKucing = (req, res) => {
    Kucing.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ message: 'Kucing berhasil dihapus'});
        }
    });
};

module.exports = {
    getAllKucing,
    getKucingById,
    createKucing,
    updateKucing,
    deleteKucing,
};