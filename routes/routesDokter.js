const express = require('express');
const multer = require("multer");
const {default: axios} = require("axios");
const uploadFile = require("../utils/fileUploader");
const getFile = require("../utils/getFile");
const controllersDokter = require('../controllers/controllersDokter');
const Dokter = require('../models/dokter')

const router = express.Router();

const multerStorage = multer.memoryStorage();
const upload = multer({storage: multerStorage})

router.get('/', controllersDokter.getAllDokter);
router.get('/:id', controllersDokter.getDokterById);
router.post('/', upload.single('foto'), controllersDokter.createDokter);
router.put('/:id', controllersDokter.updateDokter);
router.delete('/:id', controllersDokter.deleteDokter);

// router.post("/dokter", upload.single("foto"), async (req, res) => {
//     try {
//         const file = req.file;

//         console.log(file);

//         const blobData = new Blob([file.buffer], {type: file.mimetype});

//         const formData = new FormData();

//         formData.append("foto", blobData, file.originalname);

//         const response = await axios.post(
//             "https://catcares-leqtuvqrmq-et.a.run.app/dokter",
//             formData,
//             {
//                 headers: {
//                     "Content-Type": "multipart/form-data"
//                 }
//             }
//         );

//         const uploadedFile = await uploadFile(file);

//         const newDokter = await Dokter.create({
//             foto: uploadedFile.file,
//         })

//         if(!newDokter) {
//             throw {
//                 status: 500,
//                 message: "Internal server error"
//             }
//         }

//         const fileUploaded = await getFile(uploadedFile.file);

//         return res.status(200).json({
//             data: {
//                 foto: fileUploaded,
//             },
//         });
//     } catch (error) {
//         console.log(error)
//         if (!error.status) {
//             return res.status(500).json({error: "Internal server error"});
//         }
//         return res.status(error.status).json({error: error.message});
//     }
// });

module.exports = router;