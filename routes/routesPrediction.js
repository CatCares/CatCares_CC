const express = require("express");
const multer = require("multer");
const {default: axios} = require("axios");
const uploadFile = require("../utils/fileUploader");
const getFile = require("../utils/getFile");
const Ringworm = require("../models/ringworm");

const router = express.Router();

const multerStorage = multer.memoryStorage();
const upload = multer({storage: multerStorage})

router.post("/ringworm", upload.single("image"), async (req, res) => {
    try {
        const file = req.file;

        const blobData = new Blob([file.buffer], {type: file.mimetype});

        const formData = new FormData();

        formData.append("image", blobData, file.originalname);

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

        const newRingwormResult = await Ringworm.create({
            image: uploadedFile.file,
            isRingworm: response.data.predictions.isRingworm,
        })

        if(!newRingwormResult) {
            throw {
                status: 500,
                message: "Internal server error"
            }
        }

        const fileUploaded = await getFile(uploadedFile.file);

        return res.status(200).json({
            data: {
                image: fileUploaded,
                isRingworm: newRingwormResult.isRingworm,
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