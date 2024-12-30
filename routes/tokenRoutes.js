const express = require('express');
const router = express.Router();
const { getTokenBalance, purchaseTokens } = require('../controllers/tokenController');
const authenticate = require('../middlewares/authenticate');

// Get token balance
router.get('/balance', authenticate, getTokenBalance);

// Purchase tokens
router.post('/purchase', authenticate, purchaseTokens);

module.exports = router;