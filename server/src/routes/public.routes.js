const express = require('express');
const publicController = require('../controllers/public.controller');

const router = express.Router();

router.get('/services', publicController.getServices);
router.get('/facilities', publicController.getFacilities);
router.get('/pricing', publicController.getPricing);

module.exports = router;
