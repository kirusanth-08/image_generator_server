const mongoose = require("mongoose");

const generatedImageSchema = new mongoose.Schema({
  prompt: {
    type: String,
    required: true,
  },
  requestId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: false,
  },
  output_format: {
    type: String,
    required: false,
  },
  negative_prompt: {
    type: String,
    default: "",
  },
  imageUrl: {
    type: String,
    required: false,
  },
  number_of_outputs: {
    type: Number,
    required: false,
  },
  number_of_images_per_pose: {
    type: Number,
    default: 1,
  },
  images: [
    {
      type: String,
      required: false,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: String,
    required: true,
  },
  error: {
    type: String,
    required: false,
  },
});

const GeneratedImage = mongoose.model("GeneratedImage", generatedImageSchema);

module.exports = GeneratedImage;
