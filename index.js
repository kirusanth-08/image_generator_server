require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const hpp = require("hpp");
const morgan = require("morgan");
const mongoose = require("mongoose");
const rateLimit = require("express-rate-limit");
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const errorHandler = require("./middlewares/errorHandler");
// const paymentRoutes = require('./routes/paymentRoutes');
const imageGenerationRoutes = require("./routes/imageGenerationRoutes.js");
const responseTestRoute = require("./routes/responseTestRoute.js");
const userRoutes = require("./routes/userRoutes.js");

const app = express();

["STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET", "MONGODB_URI"].forEach((key) => {
  if (!process.env[key])
    throw new Error(`Missing required environment variable: ${key}`);
});

app.use(helmet());
app.use(hpp());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  keyGenerator: (req) => req.ip,
  handler: (req, res) => {
    res
      .status(429)
      .json({ error: "Too many requests, please try again later." });
  },
});
app.use(limiter);

app.use(morgan("combined"));

app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];

    try {
      const event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );

      switch (event.type) {
        case "checkout.session.completed":
          const session = event.data.object;
          const { tokenCount, userId } = session.metadata || {};
          console.log("Payment successful!", {
            tokenCount,
            userId,
            customerId: session.customer,
          });

          // TODO: Implement your business logic here
          // await User.findByIdAndUpdate(userId, {
          //   $inc: { tokenBalance: parseInt(tokenCount || 0) }
          // });
          break;

        // Handle other event types as needed
        default:
          console.log(`Unhandled event type ${event.type}`);
      }

      res.json({ received: true });
    } catch (err) {
      console.error("Webhook Error:", err.message);
      return res.status(400).json({
        error: "Webhook signature verification failed",
        message: err.message,
      });
    }
  }
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(errorHandler);

app.use("/api/image", imageGenerationRoutes);
app.use("/api", responseTestRoute);
app.use("/api/users", userRoutes);

// Database Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    const port = process.env.PORT || 8082;
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1); // Exit if database connection fails
  });

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err);
  // Gracefully shutdown server
  server.close(() => process.exit(1));
});
