const express = require('express');
const multer = require("multer");
const {default: axios} = require("axios");
const uploadFile = require("../utils/fileUploader");
const getFile = require("../utils/getFile");
const authMiddleware = require('../auth/jwtProvider');
const controllersArtikel = require('../controllers/controllersArtikel');
const router = express.Router();

const multerStorage = multer.memoryStorage();
const upload = multer({storage: multerStorage})

router.get('/list-artikel', authMiddleware, controllersArtikel.getAllArtikel);
router.get('/detail-artikel/:id', authMiddleware, controllersArtikel.getArtikelById);
router.post('/add-artikel', [authMiddleware, upload.single('foto')], controllersArtikel.createArtikel);

module.exports = router;
