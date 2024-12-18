const mongoose = require('mongoose');

const trainedModelSchema = new mongoose.Schema({
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
    loraUrl: 
    {
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

trainedModelSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const TrainedModel = mongoose.model('TrainedModel', trainedModelSchema);

module.exports = TrainedModel;