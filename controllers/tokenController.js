const User = require('../models/user'); // Assuming you have a User model

// Get token balance
const getTokenBalance = async (req, res) => {
  try {
    const user = await User.findById(req.user.uid);
    res.json({ tokenBalance: user.tokenBalance });
  } catch (err) {
    res.status(500).send('Server error');
  }
};

// Purchase tokens
const purchaseTokens = async (req, res) => {
  const { tokens } = req.body;
  if (!tokens || tokens <= 0) {
    return res.status(400).send('Invalid token amount');
  }

  try {
    const user = await User.findById(req.user.uid);
    user.tokenBalance += tokens;
    await user.save();
    res.json({ tokenBalance: user.tokenBalance });
  } catch (err) {
    res.status(500).send('Server error');
  }
};

// Calculate tokens
const calculateTokens = async (req, res) => {
    const { amountSpent } = req.body;
    if (!amountSpent || amountSpent <= 0) {
      return res.status(400).send('Invalid amount spent');
    }
  
    const tokens = amountSpent * 10; // Example conversion rate: 1 unit of currency = 10 tokens
    res.json({ tokens });
  };
  
  module.exports = {
    getTokenBalance,
    purchaseTokens,
    calculateTokens
  };