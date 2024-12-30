import { fal } from '@fal-ai/client';
const axios = require('axios');

class FALAI {
    constructor(apiToken) {
        this.apiToken = apiToken;
        this.baseUrl = 'https://api.fal.ai/v1';
    }

    async generateImage(input) {
        try {
            const response = await axios.post(
                `${this.baseUrl}/generate`,
                input,
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiToken}`,
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

    async getStatus(jobId) {
        try {
            const response = await axios.get(
                `${this.baseUrl}/status/${jobId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiToken}`
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error getting status:', error);
            throw error;
        }
    }

    async getResult(jobId) {
        try {
            const response = await axios.get(
                `${this.baseUrl}/result/${jobId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiToken}`
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

module.exports = FALAI;