const mongoose = require('mongoose');

const generatedImageSchema = new mongoose.Schema({
    prompt: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    output_format: {
        type: String,
        required: true
    },
    negative_prompt: {
        type: String,
        default: ""
    },
    imageUrl: {
        type: String,
        required: true
    },
    number_of_outputs: {
        type: Number,
        required: true
    },
    number_of_images_per_pose: {
        type: Number,
        default: 1
    },
    images: [{
        type: String,
        required: true
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const GeneratedImage = mongoose.model('GeneratedImage', generatedImageSchema);

module.exports = GeneratedImage;