const express = require('express');
const controllersDokter = require('../controllers/controllersDokter');

const router = express.Router();

router.get('/', controllersDokter.getAllDokter);
router.get('/:id', controllersDokter.getDokterById);
router.post('/', controllersDokter.createDokter);
router.put('/:id', controllersDokter.updateDokter);
router.delete('/:id', controllersDokter.deleteDokter);

module.exports = router;