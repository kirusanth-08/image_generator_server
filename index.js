require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const hpp = require("hpp");
const morgan = require("morgan");
const mongoose = require("mongoose");
const rateLimit = require("express-rate-limit");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const errorHandler = require("./middlewares/errorHandler");
const imageGenerationRoutes = require("./routes/imageGenerationRoutes.js");
const responseTestRoute = require("./routes/responseTestRoute.js");
const paymentRoutes = require("./routes/paymentRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const app = express();
const User = require("./models/User.js");

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
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    try {
      const event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        webhookSecret
      );

      if (!event || !event.data || !event.data.object) {
        console.error("Invalid webhook payload:", event);
        return res.status(400).json({ error: "Invalid webhook payload" });
      }
      console.log(`Event type: ${event.type}`);

      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object;
          const { tokenCount, userId } = session.metadata || {};

          if (!userId) {
            console.error("User ID missing in session metadata");
            break;
          }

          const tokens = parseInt(tokenCount, 10) || 0;

          if (tokens <= 0) {
            console.error("Invalid token count in session metadata");
            break;
          }

          // Update user tokens in the database
          const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $inc: { tokenBalance: tokens } },
            { new: true }
          );

          if (updatedUser) {
            console.log("User updated with new token balance:", updatedUser);
          } else {
            console.error("User not found for token update");
          }
          break;
        }

        // Handle other event types as needed
        default:
          console.log(`Unhandled event type: ${event.type}`);
          break;
      }

      // Acknowledge receipt of the event
      res.status(200).json({ received: true });
    } catch (error) {
      console.error("Error processing webhook event:", error.message);
      res.status(400).json({ error: "Webhook error: " + error.message });
    }
  }
);

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use("/api/payment", paymentRoutes);
app.use("/api/image", imageGenerationRoutes);
app.use("/api", responseTestRoute);
app.use("/api/users", userRoutes);

app.use(errorHandler);

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
