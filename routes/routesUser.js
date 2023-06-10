const express = require('express');
const multer = require("multer");
const {default: axios} = require("axios");
const uploadFile = require("../utils/fileUploader");
const getFile = require("../utils/getFile");
const controllerUser = require('../controllers/controllerUser');
const User = require('../models/user');

const router = express.Router();

const multerStorage = multer.memoryStorage();
const upload = multer({storage: multerStorage})

router.get('/:id', controllerUser.getUserById);
router.put('/:id', controllerUser.updateUser);
router.delete('/:id', controllerUser.deleteUser);

router.put("/user", upload.single("foto"), async (req, res) => {
    try {
        const file = req.file;

        console.log(file);

        const blobData = new Blob([file.buffer], {type: file.mimetype});

        const formData = new FormData();

        formData.append("foto", blobData, file.originalname);

        const response = await axios.post(
            "https://catcares-leqtuvqrmq-et.a.run.app/predict",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }
        );

        const uploadedFile = await uploadFile(file);

        const newUser = await User.create({
            foto: uploadedFile.file,
        })

        if(!newUser) {
            throw {
                status: 500,
                message: "Internal server error"
            }
        }

        const fileUploaded = await getFile(uploadedFile.file);

        return res.status(200).json({
            data: {
                foto: fileUploaded,
            },
        });
    } catch (error) {
        console.log(error)
        if (!error.status) {
            return res.status(500).json({error: "Internal server error"});
        }
        return res.status(error.status).json({error: error.message});
    }
});

module.exports = router;