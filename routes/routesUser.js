const express = require('express');
const controllerUser = require('../controllers/controllerUser');

const router = express.Router();

router.get('/:id', controllerUser.getUserById);
router.put('/:id', controllerUser.updateUser);
router.delete('/:id', controllerUser.deleteUser);

module.exports = router;