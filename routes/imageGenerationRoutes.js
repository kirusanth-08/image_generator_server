const express = require("express");
const {
  generateVariences,
  getStatusWithReplicate,
  getResultWithReplicate,
  getReplicateGeneratedImage,
  replicateWebhookHandler,
} = require("../controllers/REPLICATEGeneration");
const {
  generateImageFalDev,
  generateImageFalLora,
  falDevWebhookHandler,
  getFalGeneratedImage,
} = require("../controllers/FALGeneration");
// const authenticate = require('../middlewares/authenticate');

const router = express.Router();

// Route for generating image using FALDev
router.post(
  "/generate/faldev",
  // authenticate,
  // calculateFALDevToken,
  generateImageFalDev
);

// Route for generating image using FALLora
router.post(
  "/generate/fallora",
  // authenticate,
  //  calculateFALLoraToken,
  generateImageFalLora
);

// Route to generate image variations
router.post(
  "/generate-varience",
  // authenticate,
  generateVariences
);

// Route to get the status of a prediction
router.get(
  "/status-replicate/:predictionId",
  // authenticate,
  getStatusWithReplicate
);

// Route to get the result of a prediction
router.get(
  "/result-replicate/:predictionId",
  // authenticate,
  getResultWithReplicate
);

router.post("/webhook/faldev", falDevWebhookHandler);
router.post("/fal/generatedImage", getFalGeneratedImage);
router.post("/replicate/generatedImage", getReplicateGeneratedImage);
router.post("/webhook/replicate", replicateWebhookHandler);

module.exports = router;
