const express = require('express');
const {generateVariences} = require('../controllers/imageGeneration');
const router = express.Router();

// Route to create checkout session
router.post('/generate-varience', generateVariences);

module.exports = router;