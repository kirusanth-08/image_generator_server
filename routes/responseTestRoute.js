const express = require('express');
const router = express.Router();

// Test API request and response
router.get('/test', (req, res) => {
    console.log('Request Type:', req.method);
    console.log('Request Data:', req.query); // For GET requests, data is usually in the query parameters
    res.json({ message: 'API is working', user: req.user });
});

router.post('/test', (req, res) => {
    console.log('Request Type:', req.method);
    console.log('Request Data:', req.body); // For POST requests, data is usually in the body
    const { data } = req.body;
    res.json({ message: 'Received data', receivedData: data, user: req.user });
});

module.exports = router;