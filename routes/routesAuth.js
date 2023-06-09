const express = require('express');
const controllerUser = require('../controllers/controllerUser');

const router = express.Router();

router.post("/google", controllerUser.loginFirebase);
router.post('/login', controllerUser.loginUser);
router.post('/register', controllerUser.registerUser);

module.exports = router;