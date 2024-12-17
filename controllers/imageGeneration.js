const { request } = require('express');
const Replicate = require('replicate');

const generateVariences = async (req, res) => {
    try {
        const replicate = new Replicate({
            auth: process.env.REPLICATE_API_TOKEN,
        });
        console.log(req.body);
        const input = {
            prompt: "A headshot photo",
            subject: request.body.subject,
            output_format: "jpg",
            // output_quality: 80,
            negative_prompt: "",
            randomise_poses: true,
            number_of_outputs: request.body.number_of_outputs,
            number_of_images_per_pose: request.body.number_of_images_per_pose
          }

        const output = await replicate.run(
            "fofr/consistent-character:9c77a3c2f884193fcee4d89645f02a0b9def9434f9e03cb98460456b831c8772", 
            input
          );

        res.status(200).json(output);
    } catch (e) {
        console.log(e);
        res.status(500).send('An error occurred while processing the replicate request.');
    }
};

module.exports = {
    generateVariences
};