const mongoose = require('mongoose');

const customModelSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    modelName: {
        type: String,
        required: true
    },
    triggerWord: {
        type: String,
        default: "",
        required: true
    },
    loraUrl: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

customModelSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const CustomModel = mongoose.model('CustomModel', customModelSchema);

module.exports = CustomModel;