const axios = require("axios");

class FALAI {
  constructor(apiToken) {
    this.apiToken = process.env.FAL_API_TOKEN;
    this.baseUrl = "https://queue.fal.run/fal-ai";
  }

  async generateImage(input) {
    try {
      const webhookUrl = `${process.env.WEBHOOK_BASE_URL}/api/fal/v1/webhook`;
      const response = await axios.post(`${this.baseUrl}/flux/dev`, input, {
        headers: {
          Authorization: `Key ${process.env.FAL_API_KEY}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error generating image:", error);
      throw error;
    }
  }

  async getStatus(jobId) {
    try {
      const response = await axios.get(`${this.baseUrl}/status/${jobId}`, {
        headers: {
          Authorization: `Bearer ${this.apiToken}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error getting status:", error);
      throw error;
    }
  }

  async getResult(jobId) {
    try {
      const response = await axios.get(`${this.baseUrl}/result/${jobId}`, {
        headers: {
          Authorization: `Bearer ${this.apiToken}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error getting result:", error);
      throw error;
    }
  }
}

module.exports = FALAI;
