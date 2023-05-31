const express = require('express');
const controllersArtikel = require('../controllers/controllersArtikel');

const router = express.Router();

router.get('/', controllersArtikel.getAllArtikel);
router.get('/:id', controllersArtikel.getArtikelById);
router.post('/', controllersArtikel.createArtikel);
router.put('/:id', controllersArtikel.updateArtikel);
router.delete('/:id', controllersArtikel.deleteArtikel);

module.exports = router;
