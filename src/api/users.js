const axios = require('axios');
const Config = require('../config/config');
const OAuth2 = require('../api/oauth2');
const { logger } = require('../utils'); // Import all utils from index.js

class Users {
  constructor(envfile) {
    // Load the configuration
    this.config = new Config(envfile);
    this.baseUrl = this.config.getIdentityOAuthConfig().apiBaseUrl;
    this.oauth2 = new OAuth2(envfile);
  }

  // Setter for OAuth2 token
  setAccessToken(token) {
    this.token = token;
  }

  setIdentityConfig(identityConfig) {
    this.identityConfig = identityConfig;
  }

  // Method to search (list) users with optional filtering
  async search(queryParams = {}) {
    try {
      const token = await this.oauth2.getToken();
      const apiUrl = `${this.baseUrl}${Config.identityApi.userEndpoint}`;
      
      //const url = filter ? `${apiUrl}?filter=${filter}` : `${apiUrl}`;
      // Build the query string, excluding empty or undefined values
      const query = Object.keys(queryParams)
        .filter(key => queryParams[key] !== undefined && queryParams[key] !== null && queryParams[key] !== '')
        .map(key => `${key}=${queryParams[key]}`)
        .join('&');
      const url = query ? `${apiUrl}?${query}` : apiUrl;

      const response = await axios.get(url,
        {
          headers: {
            Authorization: `Bearer ${this.oauth2.getAccessToken()}`,
          }
        }
      );

      return response.data; // Return the list of users
    } catch (error) {
      logger.error('Error fetching users: %s', JSON.stringify(error.response?.data) || error.message);
      throw error; // Rethrow the error for further handling
    }
  }

  // Method to get user details by userId
  async getUserById(userId) {
    try {
      const token = await this.oauth2.getToken();
      const apiUrl = `${this.baseUrl}${Config.identityApi.userEndpoint}`;
      const url = `${apiUrl}/${userId}`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${this.oauth2.getAccessToken()}`,
        },
      });

      return response.data; // Return the user details
    } catch (error) {
      logger.error('Error fetching user details: %s', JSON.stringify(error.response?.data) || error.message);
      throw error; // Rethrow the error for further handling
    }
  }

  // Method to create a new user
  async createUser(data) {
    try {
      const token = await this.oauth2.getToken();
      const url = `${this.baseUrl}${Config.identityApi.userEndpoint}`;

      const response = await axios.post(url, data, {
        headers: {
          Authorization: `Bearer ${this.oauth2.getAccessToken()}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data; // Return the created user data
    } catch (error) {
      logger.error('Error fetching user details: %s', JSON.stringify(error.response?.data) || error.message);
      throw error; // Rethrow the error for further handling
    }
  }

  // Method to delete a user by userId
  async deleteUser(userId) {
    try {
      const token = await this.oauth2.getToken();
      const apiUrl = `${this.baseUrl}${Config.identityApi.userEndpoint}`;
      const url = `${apiUrl}/${userId}`;

      const response = await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${this.oauth2.getAccessToken()}`,
        },
      });

      return response; // Return the result of the deletion
    } catch (error) {
      logger.error('Error fetching user details: %s', JSON.stringify(error.response?.data) || error.message);
      throw error; // Rethrow the error for further handling
    }
  }

  /*   
    // Method to update a user by userId
    async updateUser(userId, userData) {
      try {
        const response = await axios.put(`${this.apiBaseUrl}${Config.identityApi.userEndpoint}/${userId}`, userData, {
          headers: {
            Authorization: `Bearer ${this.token}`,
            'Content-Type': 'application/json',
          },
        });
  
        return response.data; // Return the updated user details
      } catch (error) {
        logger.error('Error updating user: %s', error.response?.data || error.message);
        throw error; // Rethrow the error for further handling
      }
    }
  */
}

module.exports = Users;
