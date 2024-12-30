const TokenService = require('../plugin/token');
const tokenService = new TokenService();

// Cost parameters for FAL LoRA
const pricingInCoins = {
    costPerImage: 4,                 // 4 coins per image
    costPerLora: 1.714,              // 1.714 coins per LoRA
    costPerInferenceStep: 0.057,     // 0.057 coins per inference step per image
    costPerLargeImage: 2.285,        // 2.285 coins per large image (width or height > 512)
    costPerNSFWSafety: 1.142         // 1.142 coins per image for NSFW safety check
};


const calculateFALDevToken = async (req, res, next) => {
    const userId = req.user.id;
    const balance = await tokenService.getTokenBalance(userId);
    const requiredTokens = req.body.number_of_outputs * 4; 

    if (balance >= requiredTokens) {
        next();
    } else {
        res.status(403).json({ message: 'Insufficient tokens' });
    }
};

const calculateREPLICATEToken = async (req, res, next) => {
    const userId = req.user.id;
    const balance = await tokenService.getTokenBalance(userId);
    const requiredTokens = req.body.number_of_outputs * 5;

    if (balance >= requiredTokens) {
        next();
    } else {
        res.status(403).json({ message: 'Insufficient tokens' });
    }
};

const calculateFALLoraToken = async (req, res, next) => {
    const userId = req.user.id;
    const balance = await tokenService.getTokenBalance(userId);

    // Get parameters from the request body
    const { num_images, num_inference_steps, image_size, enable_safety_checker, loras } = req.body;

    // Basic validation for number of images
    if (!num_images || num_images <= 0) {
        return res.status(400).send('Invalid number of images');
    }

    // Validate inference steps
    if (num_inference_steps < 0) {
        return res.status(400).send('Invalid number of inference steps');
    }

    // Initialize total cost in coins
    let totalCostCoins = 0;

    // Cost for the images themselves (4 coins per image)
    totalCostCoins += num_images * pricingInCoins.costPerImage;

    // Cost for LoRAs (if any)
    if (loras && loras.length > 0) {
        totalCostCoins += loras.length * pricingInCoins.costPerLora;
    }

    // Cost for inference steps
    totalCostCoins += num_images * num_inference_steps * pricingInCoins.costPerInferenceStep;

    // Check for large image size (width or height > 512)
    const isLargeImage = image_size && (image_size.width > 512 || image_size.height > 512);
    if (isLargeImage) {
        totalCostCoins += num_images * pricingInCoins.costPerLargeImage;
    }

    // Add cost for NSFW safety check (if enabled)
    if (enable_safety_checker) {
        totalCostCoins += num_images * pricingInCoins.costPerNSFWSafety;
    }

    // Round up the total cost to the next integer
    const roundedCostCoins = Math.ceil(totalCostCoins);

    // Check if the user has enough balance (in coins)
    if (balance >= roundedCostCoins) {
        next(); // Proceed if the user has enough balance
    } else {
        res.status(403).json({ message: 'Insufficient funds' });
    }
};

const calculateTrainingToken = async (req, res, next) => {
    const userId = req.user.id;
    const balance = await tokenService.getTokenBalance(userId);
    const requiredTokens = req.body.number_of_outputs * 5;

    if (balance >= requiredTokens) {
        next();
    } else {
        res.status(403).json({ message: 'Insufficient tokens' });
    }
};

module.exports = {
    calculateFALDevToken,
    calculateREPLICATEToken,
    calculateFALLoraToken,
    calculateTrainingToken
};