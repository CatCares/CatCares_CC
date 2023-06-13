const express = require('express');
const multer = require("multer");
const {default: axios} = require("axios");
const uploadFile = require("../utils/fileUploader");
const getFile = require("../utils/getFile");
const controllersDokter = require('../controllers/controllersDokter');
const Dokter = require('../models/dokter')
const authMiddleware = require('../auth/jwtProvider');
const router = express.Router();

const multerStorage = multer.memoryStorage();
const upload = multer({storage: multerStorage})

// router.get('/', controllersDokter.getAllDokter);
// router.get('/:id', controllersDokter.getDokterById);
// router.put('/:id', controllersDokter.updateDokter);
// router.delete('/:id', controllersDokter.deleteDokter);
router.post('/add-dokter', [authMiddleware, upload.single('foto')], controllersDokter.createDokter);
router.get('/list-dokter', authMiddleware, controllersDokter.getAllDokter)
router.get('/detail-dokter/:dokterId', authMiddleware, controllersDokter.getDokterById)

module.exports = router;