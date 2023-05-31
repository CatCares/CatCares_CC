const express = require('express');
const controllerKucing = require('../controllers/controllersKucing');

const router = express.Router();

router.get('/', controllerKucing.getAllKucing);
router.get('/:id', controllerKucing.getKucingById);
router.post('/', controllerKucing.createKucing);
router.put('/:id', controllerKucing.updateKucing);
router.delete('/:id', controllerKucing.deleteKucing);

module.exports = router;