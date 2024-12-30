const mongoose = require('mongoose');

const faceSchema = new mongoose.Schema({
    prompt: {
        type: String,
        required: true
    },
    imageUrl: {
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
    randomise_poses: {
        type: Boolean,
        default: true
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
        type: String
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Face = mongoose.model('Face', faceSchema);

module.exports = Face;