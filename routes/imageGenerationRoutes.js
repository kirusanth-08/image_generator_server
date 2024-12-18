const express = require('express');
const { generateVariences, getStatusWithReplicate, getResultWithReplicate } = require('../controllers/REPLICATEGeneration');
const authenticate = require('../middlewares/authenticate');

const router = express.Router();

// Route to generate image variations
router.post('/generate-varience', authenticate, generateVariences);

// Route to get the status of a prediction
router.get('/status-replicate/:predictionId', authenticate, getStatusWithReplicate);

// Route to get the result of a prediction
router.get('/result-replicate/:predictionId', authenticate, getResultWithReplicate);

module.exports = router;