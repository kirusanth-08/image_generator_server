const Replicate = require('../plugin/replicate');

const generateVariences = async (req, res) => {
    try {
        const replicate = new Replicate(process.env.REPLICATE_API_TOKEN);
        const input = {
            prompt: "A headshot photo",
            subject: req.body.input.subject,
            output_format: "jpg",
            // output_quality: 80,
            negative_prompt: "",
            randomise_poses: true,
            number_of_outputs: req.body.input.number_of_outputs,
            // number_of_images_per_pose: req.body.input.number_of_images_per_pose
        };

        const response = await replicate.generateImage(input);
        console.log(response); // Debugging
        res.status(200).json(response);
    } catch (e) {
        console.log(e);
        res.status(500).send('An error occurred while processing the request.');
    }
};

const getStatusWithReplicate = async (req, res) => {
    try {
        const replicate = new Replicate(process.env.REPLICATE_API_TOKEN);
        const predictionId = req.params.predictionId;

        const response = await replicate.getStatus(predictionId);
        res.status(200).json(response);
    } catch (error) {
        console.error('Error getting status:', error);
        res.status(500).send('An error occurred while getting the status.');
    }
};

const getResultWithReplicate = async (req, res) => {
    try {
        const replicate = new Replicate(process.env.REPLICATE_API_TOKEN);
        const predictionId = req.params.predictionId;

        const response = await replicate.getResult(predictionId);
        res.status(200).json(response);
    } catch (error) {
        console.error('Error getting result:', error);
        res.status(500).send('An error occurred while getting the result.');
    }
};

module.exports = {
    generateVariences,
    getStatusWithReplicate,
    getResultWithReplicate
};