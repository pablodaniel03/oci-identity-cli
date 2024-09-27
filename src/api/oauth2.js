// src/api/auth.js
const { identityConfig } = require('../config/config');
const logger = require('../utils/logger'); // Import the logger
const axios = require('axios');


let accessToken = null;

class OAuth2 {
  constructor() {
    this.apiUrl = `${identityConfig.apiBaseUrl}${identityConfig.tokenEndpoint}`; // Construct the token URL
    this.accessToken = null;
    this.expiresIn = null;
    this.tokenType = null;

    logger.debug(`Token URL initialized: ${this.apiUrl}`); // Log the initialized token URL
  }

  async getToken(clientId = identityConfig.clientId, clientSecret = identityConfig.clientSecret, clientScope = identityConfig.clientScope) {
    try {
      // Create URLSearchParams for form-urlencoded data
      const urlencoded = new URLSearchParams();
      urlencoded.append('grant_type', 'client_credentials');
      urlencoded.append('scope', identityConfig.clientScope);

      logger.debug('Requesting OAuth2 token with clientId: %s', clientId);
      const response = await axios.post(this.apiUrl, urlencoded.toString(),
        {
          auth: {
            username: clientId,
            password: clientSecret
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
      logger.debug('Token obtained successfully: %s', JSON.stringify(response.data)); // Log the successful token retrieval
      this.accessToken = response.data.access_token;
      this.tokenType = response.data.token_type;
      this.expiresIn = response.data.expires_in;

      return response.data; // Return the token data
    } catch (error) {
      logger.error('Error obtaining token: %s', error.response?.data || error.message); // Log error details
      throw error; // Re-throw the error for further handling if needed
    }
  }
  // Method to get the stored access token
  //getAccessToken() {
  //  return this.accessToken; // Return the internal access token
  //}
}
module.exports = new OAuth2();