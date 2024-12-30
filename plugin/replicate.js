const axios = require('axios');

class Replicate {
    constructor(apiToken) {
        this.apiToken = apiToken;
        this.baseUrl = 'https://api.replicate.com/v1';
    }

    async generateImage(input) {
        try {
            const response = await axios.post(
                `${this.baseUrl}/predictions`,
                {
                    version: "9c77a3c2f884193fcee4d89645f02a0b9def9434f9e03cb98460456b831c8772",
                    input: input
                },
                {
                    headers: {
                        'Authorization': `Token ${this.apiToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error generating image:', error);
            throw error;
        }
    }

    async getStatus(predictionId) {
        try {
            const response = await axios.get(
                `${this.baseUrl}/predictions/${predictionId}`,
                {
                    headers: {
                        'Authorization': `Token ${this.apiToken}`
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error getting status:', error);
            throw error;
        }
    }

    async getResult(predictionId) {
        try {
            const response = await axios.get(
                `${this.baseUrl}/predictions/${predictionId}/result`,
                {
                    headers: {
                        'Authorization': `Token ${this.apiToken}`
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error getting result:', error);
            throw error;
        }
    }
}

module.exports = Replicate;