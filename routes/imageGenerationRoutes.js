const express = require("express");
const {
  generateVariences,
  getStatusWithReplicate,
  getResultWithReplicate,
} = require("../controllers/REPLICATEGeneration");
const {
  generateImageFalDev,
  generateImageFalLora,
} = require("../controllers/FALGeneration");
// const authenticate = require('../middlewares/authenticate');

const router = express.Router();

// Route for generating image using FALDev
router.post(
  "/generate/faldev", //Build a Face
  // authenticate,
  // calculateFALDevToken,
  generateImageFalDev
);

// Route for generating image using FALLora
router.post(
  "/generate/fallora", //Generate Image
  // authenticate,
  //  calculateFALLoraToken,
  generateImageFalLora
);

// Route to generate image variations
router.post(
  "/generate-varience", //Create Character Variations
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

module.exports = router;
