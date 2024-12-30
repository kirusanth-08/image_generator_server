const Replicate = require('replicate');

const generateVariences = async (req, res) => {
    try {
        const replicate = new Replicate();

        const input = {
            prompt: "A headshot photo",
            subject: req.body.subject,
            number_of_outputs: req.body.number_of_outputs,
            number_of_images_per_pose: req.body.number_of_images_per_pose,
        }

        const events = [];
        for await (const event of replicate.stream("fofr/consistent-character:9c77a3c2f884193fcee4d89645f02a0b9def9434f9e03cb98460456b831c8772", input)) {
            events.push(event);
        }

        res.status(200).json(events);
    } catch (e) {
        console.log(e);
        res.status(500).send('An error occurred while processing the replicate request.');
    }
};

module.exports = {
    generateVariences
};