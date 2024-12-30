const express = require('express');
const { createCheckoutSession} = require('../controllers/paymentController');
const router = express.Router();
const bodyParser = require('body-parser');


router.post('/create-checkout-session', createCheckoutSession);


module.exports = router;