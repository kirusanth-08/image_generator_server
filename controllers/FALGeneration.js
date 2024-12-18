
const FALAI = require("../plugin/fal");

const generateImageFalDev = async (req, res) => {
  try {
    const fal = new FALAI(process.env.FAL_API_TOKEN);
    const input = {
      prompt: req.body.prompt,
      subject: req.body.subject,
      output_format: req.body.output_format,
      number_of_outputs: req.body.number_of_outputs,
    };

    const response = await fal.generateImage(input);
    res.status(200).json(response);
  } catch (error) {
    console.error("Error generating image:", error);
    res.status(500).send("An error occurred while generating the image.");
  }
};

const generateImageFalLora = async (req, res) => {
  try {
    const fal = new FALAI(process.env.FAL_API_TOKEN);
    const response = {
      prompt: req.body.input.prompt,
      num_inference_steps: req.body.input.num_inference_steps,
      guidance_scale: req.body.input.guidance_scale,
      num_images: req.body.input.num_images,
      enable_safety_checker: req.body.input.enable_safety_checker,
      output_format: req.body.input.output_format,
      loras: req.body.input.loras,
      seed: req.body.input.seed,
      image_size: req.body.input.image_size || undefined,
    };
    console.log(response)
    // const response = await fal.generateImage(input);
    res.status(200).json(response);
  } catch (error) {
    console.error("Error generating image:", error);
    res.status(500).send("An error occurred while generating the image.");
  }
};

const getStatusWithFAL = async (req, res) => {
  try {
    const fal = new FALAI(process.env.FAL_API_TOKEN);
    const jobId = req.params.jobId;

    const response = await fal.getStatus(jobId);
    res.status(200).json(response);
  } catch (error) {
    console.error("Error getting status:", error);
    res.status(500).send("An error occurred while getting the status.");
  }
};

const getResultWithFAL = async (req, res) => {
  try {
    const fal = new FALAI(process.env.FAL_API_TOKEN);
    const jobId = req.params.jobId;

    const response = await fal.getResult(jobId);
    res.status(200).json(response);
  } catch (error) {
    console.error("Error getting result:", error);
    res.status(500).send("An error occurred while getting the result.");
  }
};

module.exports = {
  generateImageFalDev,
  generateImageFalLora,
  getStatusWithFAL,
  getResultWithFAL,
};
