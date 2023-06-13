const express = require('express');
const multer = require("multer");
const {default: axios} = require("axios");
const uploadFile = require("../utils/fileUploader");
const getFile = require("../utils/getFile");
const controllerUser = require('../controllers/controllerUser');
const User = require('../models/user');
const authMiddleware = require('../auth/jwtProvider');

const router = express.Router();

const multerStorage = multer.memoryStorage();
const upload = multer({storage: multerStorage})

router.get('/profile', authMiddleware, controllerUser.getProfile)
router.put('/update-profile', [authMiddleware, upload.single("foto")], controllerUser.updateUser);
// router.get('/:id', controllerUser.getUserById);
// router.delete('/:id', controllerUser.deleteUser);



module.exports = router;