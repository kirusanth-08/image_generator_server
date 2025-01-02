const Replicate = require("replicate");
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});
const cloudinary = require("cloudinary").v2;
const fetch = require("node-fetch");
const GeneratedImageSchema = require("../models/generatedImages");
cloudinary.config({
  cloud_name: "dgaz3npgq", // Replace with your cloud name
  api_key: "452792492559544", // Replace with your API key
  api_secret: "yF9lPLOysXJEsFOs3DF1fHh6XaE", // Replace with your API secre
});

const generateVariences = async (req, res) => {
  try {
    // console.log("req.body", req.body);
    const input = {
      prompt: req.body.prompt,
      subject: req.body.subject,
      output_format: "png",
      output_quality: 80,
      negative_prompt: "",
      randomise_poses: true,
      number_of_outputs: req.body.no_of_variations,
      number_of_images_per_pose: req.body.image_per_variation,
    };

    console.log("input", input);

    const callbackURL = `${process.env.WEBHOOK_BASE_URL}/api/image/webhook/replicate`;
    const response = await replicate.predictions.create({
      version:
        "9c77a3c2f884193fcee4d89645f02a0b9def9434f9e03cb98460456b831c8772",
      input: input,
      webhook: callbackURL,
      webhook_events_filter: ["completed"],
    });

    if (response) {
      const generatedImage = new GeneratedImageSchema({
        userId: req.body.user_id,
        prompt: req.body.prompt,
        createdAt: new Date(),
        number_of_images_per_pose: req.body.no_of_variations,
        requestId: response.id,
        status: response.status,
      });
      await generatedImage.save();
      res.status(200).json({ request_id: response.id });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send("An error occurred while processing the request.");
  }
};

const replicateWebhookHandler = async (req, res) => {
  try {
    console.log("Webhook received----------------------", req.body);

    if (req.body.error != null) {
      console.log("Error in webhook processing:", req.body.error);
      const generation = await GeneratedImageSchema.findOne({
        requestId: req.body.id,
      });
      if (generation) {
        generation.status = "failed";
        generation.error = req.body.error;
        await generation.save();
      }

      res.status(200).send("Webhook processed");
      return;
    }
    if (req.body.output) {
      async function uploadImageArray(imageUrls) {
        try {
          // Check accessibility for all URLs before uploading
          const accessibleUrls = await Promise.all(
            imageUrls.map(async (url) => {
              const response = await fetch(url);
              if (!response.ok) {
                throw new Error(`Image not accessible: ${url}`);
              }
              console.log(`Image URL accessible: ${url}`);
              return url;
            })
          );

          // Upload each accessible image to Cloudinary
          const uploadResults = await Promise.all(
            accessibleUrls.map(async (url) => {
              const result = await cloudinary.uploader.upload(url, {
                resource_type: "image",
              });
              console.log(`Uploaded image: ${url} to ${result.secure_url}`);
              return result.secure_url; // Store the public URL
            })
          );

          console.log("All images uploaded successfully!");
          return uploadResults; // Return array of public URLs
        } catch (error) {
          console.error("Error during image upload:", error);
          throw error;
        }
      }

      const imageUrls = req.body.output;

      uploadImageArray(imageUrls)
        .then(async (uploadedUrls) => {
          console.log("Uploaded URLs:", uploadedUrls);

          const generation = await GeneratedImageSchema.findOne({
            requestId: req.body.id,
          });
          if (generation) {
            generation.status = "completed";
            generation.images = uploadedUrls;
            await generation.save();
          }

          res.status(200).json({ message: "Images uploaded successfully" });
          return;
        })
        .catch((error) => {
          console.error("Failed to upload images:", error);
          res.status(500).json({ error: "Failed to upload images" });
          return;
        });
    }
  } catch (error) {
    console.error("Webhook processing error:", error);
    res.status(500).json({ error: "Failed to process webhook" });
  }
};

const getStatusWithReplicate = async (req, res) => {
  try {
    const replicate = new Replicate(process.env.REPLICATE_API_TOKEN);
    const predictionId = req.params.predictionId;

    const response = await replicate.getStatus(predictionId);
    res.status(200).json(response);
  } catch (error) {
    console.error("Error getting status:", error);
    res.status(500).send("An error occurred while getting the status.");
  }
};

const getResultWithReplicate = async (req, res) => {
  try {
    const replicate = new Replicate(process.env.REPLICATE_API_TOKEN);
    const predictionId = req.params.predictionId;

    const response = await replicate.getResult(predictionId);
    res.status(200).json(response);
  } catch (error) {
    console.error("Error getting result:", error);
    res.status(500).send("An error occurred while getting the result.");
  }
};

const getReplicateGeneratedImage = async (req, res) => {
  const { requestId } = req.body;
  const generation = await GeneratedImageSchema.findOne({
    requestId: requestId,
  });
  console.log("generation", generation);

  if (!generation) {
    return res.status(404).json({ error: "Generation not found" });
  }

  if (generation.status === "failed") {
    return res.status(500).json({
      error: generation.error
        ? generation.error
        : "Error occurred during generation, please try again later",
    });
  }

  if (generation.status !== "completed") {
    const data = await replicate.predictions.get(requestId);

    console.log("data", data);
    if (data.status == "starting") {
      const resp = {
        status: data.status,
        progress: { currentprogress: 25, totalprogress: 100 },
      };
      res.json(resp);
    } else if (data.status == "processing") {
      const resp = {
        status: data.status,
        progress: { currentprogress: 99, totalprogress: 100 },
      };
      res.json(resp);
    } else if (data.status == "successful") {
      const resp = {
        status: data.status,
        progress: { currentprogress: 100, totalprogress: 100 },
      };
      res.json(resp);
    } else if (data.status == "failed") {
      return res.status(500).json({
        error: "Error occurred during generation, please try again later",
      });
    } else {
      const resp = {
        status: data.status,
        progress: { currentprogress: 0, totalprogress: 100 },
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
};

module.exports = {
  generateVariences,
  getStatusWithReplicate,
  getResultWithReplicate,
  getReplicateGeneratedImage,
  replicateWebhookHandler,
};
