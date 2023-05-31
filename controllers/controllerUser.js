const User = require('../models/user');

// Profil User
const getUserById = (req, res) => {
    User.findById(req.params.id, (err, user) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(user);
        }
    });
};

// Update Profil User
const updateUser =(req, res) => {
    User.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true },
        (err, user) => {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json(user);
            }
        }
    );
};

// Delete User
const deleteUser = (req, res) => {
    Kucing.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ message: 'User berhasil dihapus'});
        }
    });
};

module.exports = {
    getUserById,
    updateUser,
    deleteUser,
};