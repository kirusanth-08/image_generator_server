require('dotenv').config(); // Load environment variables
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const hpp = require('hpp');
const morgan = require('morgan');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const errorHandler = require('./middlewares/errorHandler');
const paymentRoutes = require('./routes/paymentRoutes');
const imageGenerationRoutes = require('./routes/imageGenerationRoutes.js');

const app = express();



// Validate Environment Variables
['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET', 'MONGODB_URI'].forEach((key) => {
  if (!process.env[key]) throw new Error(`Missing required environment variable: ${key}`);
});


// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    const port = process.env.PORT || 8082;
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch((error) => console.error('Error connecting to MongoDB:', error.message));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(hpp());
app.use(morgan('combined'));

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit per IP
  keyGenerator: (req) => req.ip,
});
app.use(limiter);

// Payment Routes
app.use('/api/payment', paymentRoutes);
// Image Generation Routes
app.use('/api/image', imageGenerationRoutes);


  

// Error Handling Middleware
app.use(errorHandler);

