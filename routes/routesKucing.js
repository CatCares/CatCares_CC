const express = require('express');
const multer = require("multer");
const {default: axios} = require("axios");
const uploadFile = require("../utils/fileUploader");
const getFile = require("../utils/getFile");
const controllerKucing = require('../controllers/controllersKucing');
const Kucing = require('../models/kucing');
const authMiddleware = require('../auth/jwtProvider');

const router = express.Router();

const multerStorage = multer.memoryStorage();
const upload = multer({storage: multerStorage})

// router.get('/', controllerKucing.getAllKucing);
// router.get('/:id', controllerKucing.getKucingById);
// router.post('/', upload.single('foto'), controllerKucing.createKucing);
// router.put('/:id', controllerKucing.updateKucing);

router.post('/add-kucing', [authMiddleware, upload.single('foto')], controllerKucing.registerUserCat)
router.get('/user', authMiddleware, controllerKucing.getUserCat)
router.get('/user/:kucingId', authMiddleware, controllerKucing.getUserCatDetail)
router.delete('/user/:kucingId',authMiddleware, controllerKucing.deleteKucing);

module.exports = router;