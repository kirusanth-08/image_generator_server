const StoredLora = require('../models/StoredLora');

// Create a new StoredLora
const createStoredLora = async (req, res) => {
    try {
        const { modelName, triggerWord, loraUrl } = req.body;
        const storedLora = new StoredLora({
            user: req.user.id,
            modelName,
            triggerWord,
            loraUrl
        });
        await storedLora.save();
        res.status(201).json(storedLora);
    } catch (error) {
        res.status(500).json({ message: 'Error creating StoredLora', error });
    }
};

// Get all StoredLoras for a user
const getStoredLoras = async (req, res) => {
    try {
        const storedLoras = await StoredLora.find({ user: req.user.id });
        res.status(200).json(storedLoras);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching StoredLoras', error });
    }
};

// Get a single StoredLora by ID
const getStoredLoraById = async (req, res) => {
    try {
        const storedLora = await StoredLora.findById(req.params.id);
        if (!storedLora || storedLora.user.toString() !== req.user.id) {
            return res.status(404).json({ message: 'StoredLora not found' });
        }
        res.status(200).json(storedLora);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching StoredLora', error });
    }
};

// Update a StoredLora by ID
const updateStoredLora = async (req, res) => {
    try {
        const { modelName, triggerWord, loraUrl } = req.body;
        const storedLora = await StoredLora.findById(req.params.id);
        if (!storedLora || storedLora.user.toString() !== req.user.id) {
            return res.status(404).json({ message: 'StoredLora not found' });
        }
        storedLora.modelName = modelName || storedLora.modelName;
        storedLora.triggerWord = triggerWord || storedLora.triggerWord;
        storedLora.loraUrl = loraUrl || storedLora.loraUrl;
        storedLora.updatedAt = Date.now();
        await storedLora.save();
        res.status(200).json(storedLora);
    } catch (error) {
        res.status(500).json({ message: 'Error updating StoredLora', error });
    }
};

// Delete a StoredLora by ID
const deleteStoredLora = async (req, res) => {
    try {
        const storedLora = await StoredLora.findById(req.params.id);
        if (!storedLora || storedLora.user.toString() !== req.user.id) {
            return res.status(404).json({ message: 'StoredLora not found' });
        }
        await storedLora.remove();
        res.status(200).json({ message: 'StoredLora deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting StoredLora', error });
    }
};

module.exports = {
    createStoredLora,
    getStoredLoras,
    getStoredLoraById,
    updateStoredLora,
    deleteStoredLora
};