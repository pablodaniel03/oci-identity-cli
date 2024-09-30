// src/api/auth.js
const Config = require('../config/config');
const logger = require('../utils/logger'); // Import the logger
const axios = require('axios');


class OAuth2 {
  // OAuth2 Token properties
  accessToken = null;
  expiresIn = null;
  tokenType = null;

  constructor(envfile = null) {
    this.config = new Config(envfile); // Pass the envfile to Config

    if (envfile != null) {
      const oauthConfig = this.config.getIdentityOAuthConfig(); // Get the identity configuration

      // Environment validation moved to config.js
      this.apiBaseUrl = oauthConfig.apiBaseUrl; // Construct the token URL
      this.clientId = oauthConfig.clientId;
      this.clientSecret = oauthConfig.clientSecret;
      this.clientScope = oauthConfig.clientScope;

      logger.debug('OAuth2: environment "%s" loaded. %o', envfile, oauthConfig);
    }
  }

  // Getter and Setter for envfile
  getEnvFile() { return this.envfile; }
  setEnvFile(envfile) { 
    logger.debug(`OAuth2: setting environment file "${envfile}"`);
    this.envfile = envfile; 
  }
  // Getter and Setter for accessToken
  getAccessToken() { return this.accessToken; }
  setAccessToken(token) { this.accessToken = token; }
  // Getter and Setter for expiresIn
  getExpiresIn() { return this.expiresIn; }
  setExpiresIn(expirationTime) { this.expiresIn = expirationTime; }
  // Getter and Setter for tokenType
  getTokenType() { return this.tokenType; }
  setTokenType(type) { this.tokenType = type; }
  
  // Check if the token is still valid
  // isTokenValid() {
  //   return this.accessToken && this.expiresIn && (Date.now() < (this.expiresIn * 1000));
  // }

  async getToken(identityUrl = this.apiBaseUrl,
                 clientId = this.clientId, 
                 clientSecret = this.clientSecret,
                 clientScope = this.clientScope) {
    try {
      const apiEndpoint = Config.identityApi.tokenEndpoint;
      const tokenApiUrl = identityUrl + apiEndpoint;

      // Create URLSearchParams for form-urlencoded data
      const urlencoded = new URLSearchParams();
      urlencoded.append('grant_type', 'client_credentials');
      urlencoded.append('scope', clientScope);

      logger.debug('OAuth2: [%s] requesting token using clientId: %s', tokenApiUrl, clientId);
      const response = await axios.post(tokenApiUrl, urlencoded.toString(),
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
      
      this.setAccessToken(response.data.access_token);
      this.setTokenType(response.data.token_type);
      this.setExpiresIn(response.data.expires_in);
      
      // Log the successful token retrieval
      logger.debug('Token obtained successfully: %o',
        JSON.stringify(
          {
            "accessToken": `${this.getAccessToken().substring(0, 20)}...`,
            "tokenType": this.getTokenType(),
            "expiresIn": this.getExpiresIn()
          }
        ), null, 5); 

      return response.data; // Return the token data
    } catch (error) {
      logger.error('Error obtaining token: %s', error.response?.data || error.message); // Log error details
      throw error; // Re-throw the error for further handling if needed
    }
  }
}
module.exports = OAuth2;