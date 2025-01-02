const FALAI = require("../plugin/fal");
const GeneratedImageSchema = require("../models/generatedImages");
const axios = require("axios");

const { fal } = require("@fal-ai/client");

fal.config({
  credentials:
    "75aa951b-edfb-4e96-b169-e4480d41841b:874cc9f4f50aa05e6feffb7ee36f8030",
});

const generateImageFalDev = async (req, res) => {
  try {
    // const fal = new FALAI(process.env.FAL_API_TOKEN);
    const { no_of_images, prompt, user_id } = req.body;
    const input = {
      prompt: prompt,
      image_size: "landscape_4_3",
      num_inference_steps: 28,
      guidance_scale: 3.5,
      num_images: no_of_images,
      enable_safety_checker: true,
    };

    const data = await fal.queue.submit("fal-ai/flux/dev", {
      input: input,
      webhookUrl: `${process.env.WEBHOOK_BASE_URL}/api/image/webhook/faldev`,
    });

    console.log(data);
    if (data) {
      const generatedImage = new GeneratedImageSchema({
        userId: user_id,
        prompt: prompt,
        createdAt: new Date(),
        number_of_images_per_pose: no_of_images,
        requestId: data.request_id,
        status: data.status,
      });
      await generatedImage.save();
    }

    res.status(200).json({ request_id: data.request_id });
  } catch (error) {
    console.error("Error generating image:", error);
    res.status(500).send("An error occurred while generating the image.");
  }
};

const falDevWebhookHandler = async (req, res) => {
  try {
    console.log("Webhook received----------------------");
    console.log(req.body);
    console.log("---------------------------------");
    console.log(req.body.payload.images);
    console.log("---------------------------------");
    console.log(req.body.payload.images[0]);
    if (req.body.status === "OK") {
      const generation = await GeneratedImageSchema.findOne({
        requestId: req.body.request_id,
      });
      if (generation) {
        let images = [];
        generation.status = "completed";
        req.body.payload.images.map((image) => {
          images.push(image.url);
        });
        generation.images = images;
        await generation.save();
      }
    }

    res.status(200).send("Webhook processed");
  } catch (error) {
    console.error("Webhook processing error:", error);
    res.status(500).json({ error: "Failed to process webhook" });
  }
};

function getLatestProgress(dataArray) {
  if (!Array.isArray(dataArray) || dataArray.length === 0) {
    return { currentprogress: 0, totalprogress: 0 }; // Default values if the array is invalid or empty
  }

  // Get the latest element in the array
  const latestElement = dataArray[dataArray.length - 1];

  // Extract the message field
  const message = latestElement.message;

  // Use a regular expression to extract progress numbers
  const match = message.match(/(\d+)%/);
  if (match) {
    const currentprogress = parseInt(match[1], 10);
    const totalprogress = 100;
    return { currentprogress, totalprogress };
  }

  return { currentprogress: 0, totalprogress: 0 }; // Default values if parsing fails
}

const getFalGeneratedImage = async (req, res) => {
  try {
    console.log("getGeneratedImage req.body", req.body);
    const { request_id } = req.body;

    const generation = await GeneratedImageSchema.findOne({
      requestId: request_id,
    });

    console.log("generation", generation);

    if (!generation) {
      return res.status(404).json({ error: "Generation not found" });
    }

    if (generation.status !== "completed") {
      const data = await fal.queue.status("fal-ai/flux/dev", {
        requestId: request_id,
        logs: true,
      });

      console.log("data", data);
      if (data) {
        const resp = {
          status: data.status,
          progress: getLatestProgress(data.logs),
        };
        res.json(resp);
      }
    } else {
      const response = {
        status: generation.status,
        images: generation.images,
      };
      res.json(response);
    }
  } catch (error) {
    console.error("Status check error:", error);
    res.status(500).json({ error: "Failed to check generation status" });
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
    console.log(response);
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
  falDevWebhookHandler,
  getFalGeneratedImage,
};
