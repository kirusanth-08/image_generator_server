const FALAI = require('../plugin/fal');

const generateImageWithFAL = async (req, res) => {
    try {
        const fal = new FALAI(process.env.FAL_API_TOKEN);
        const input = {
            prompt: req.body.prompt,
            subject: req.body.subject,
            output_format: req.body.output_format,
            number_of_outputs: req.body.number_of_outputs
        };

        const response = await fal.generateImage(input);
        res.status(200).json(response);
    } catch (error) {
        console.error('Error generating image:', error);
        res.status(500).send('An error occurred while generating the image.');
    }
};

const getStatusWithFAL = async (req, res) => {
    try {
        const fal = new FALAI(process.env.FAL_API_TOKEN);
        const jobId = req.params.jobId;

        const response = await fal.getStatus(jobId);
        res.status(200).json(response);
    } catch (error) {
        console.error('Error getting status:', error);
        res.status(500).send('An error occurred while getting the status.');
    }
};

const getResultWithFAL = async (req, res) => {
    try {
        const fal = new FALAI(process.env.FAL_API_TOKEN);
        const jobId = req.params.jobId;

        const response = await fal.getResult(jobId);
        res.status(200).json(response);
    } catch (error) {
        console.error('Error getting result:', error);
        res.status(500).send('An error occurred while getting the result.');
    }
};

module.exports = {
    generateImageWithFAL,
    getStatusWithFAL,
    getResultWithFAL
};