// pricing.js

const pricingInCoins = {
    FALDev: {
        costPerImage: 4,                 // 4 coins per image
        costPerLora: 1.714,              // 1.714 coins per LoRA
        costPerInferenceStep: 0.057,     // 0.057 coins per inference step per image
        costPerLargeImage: 2.285,        // 2.285 coins per large image (width or height > 512)
        costPerNSFWSafety: 1.142         // 1.142 coins per image for NSFW safety check
    },
    REPLICATE: {
        costPerImage: 5,                 // 5 coins per image
        costPerLora: 2,                  // 2 coins per LoRA
        costPerInferenceStep: 0.05,      // 0.05 coins per inference step per image
        costPerLargeImage: 2.5,          // 2.5 coins per large image
        costPerNSFWSafety: 1.5           // 1.5 coins per image for NSFW safety check
    },
    FALLora: {
        costPerImage: 4,                 // 4 coins per image
        costPerLora: 1.714,              // 1.714 coins per LoRA
        costPerInferenceStep: 0.057,     // 0.057 coins per inference step per image
        costPerLargeImage: 2.285,        // 2.285 coins per large image (width or height > 512)
        costPerNSFWSafety: 1.142         // 1.142 coins per image for NSFW safety check
    }
};

// Export the pricing object so that it can be used in other files
module.exports = pricingInCoins;
