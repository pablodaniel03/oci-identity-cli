// src/api/users.js
const axios = require('axios');
const { identityConfig } = require('../config/config');
const OAuth2 = require('./oauth2'); // Import the OAuth2 instance to get the access token
const logger = require('../utils/logger'); // Import the Pino logger

class Users {
    constructor() {
        this.apiUrl = `${identityConfig.apiBaseUrl}${identityConfig.userEndpoint}`; // Construct the API URL

        logger.debug(`Users URL initialized: ${this.apiUrl}`); // Log the initialized token URL
    }

    // Method to create a new user
    async createUser(userData) {
        try {
            const token = OAuth2.getToken(); // Get the access token
            logger.info('Creating user with data:', userData); // Log user creation attempt

            const response = await axios.post(this.apiUrl, userData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            logger.info('User created successfully:', response.data); // Log successful creation
            return response.data; // Return the created user data
        } catch (error) {
            logger.error('Error creating user:', error.response?.data || error.message); // Log error
            throw error; // Re-throw the error for further handling if needed
        }
    }

    // Method to get a user by ID
    async getUserById(userId) {
        try {
            const token = await OAuth2.getToken(); // Get the access token
            logger.info(`Retrieving user with ID: ${userId}`); // Log retrieval attempt

            const response = await axios.get(`${this.apiUrl}/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token.access_token}`,
                },
            });

            logger.info('User retrieved successfully:', response.data); // Log successful retrieval
            return response.data; // Return the user data
        } catch (error) {
            logger.error('Error retrieving user:', error.response?.data || error.message); // Log error
            throw error; // Re-throw the error for further handling if needed
        }
    }

    // Method to update a user by ID
    async updateUser(userId, userData) {
        try {
            const token = OAuth2.getToken(); // Get the access token
            logger.info(`Updating user with ID: ${userId} and data:`, userData); // Log update attempt

            const response = await axios.put(`${this.apiUrl}/${userId}`, userData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            logger.info('User updated successfully:', response.data); // Log successful update
            return response.data; // Return the updated user data
        } catch (error) {
            logger.error('Error updating user:', error.response?.data || error.message); // Log error
            throw error; // Re-throw the error for further handling if needed
        }
    }

    // Method to delete a user by ID
    async deleteUser(userId) {
        try {
            const token = OAuth2.getToken(); // Get the access token
            logger.info(`Deleting user with ID: ${userId}`); // Log deletion attempt

            const response = await axios.delete(`${this.apiUrl}/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            logger.info('User deleted successfully:', response.data); // Log successful deletion
            return response.data; // Return the response from the delete operation
        } catch (error) {
            logger.error('Error deleting user:', error.response?.data || error.message); // Log error
            throw error; // Re-throw the error for further handling if needed
        }
    }

    // Method to list all users (optional)
    async listUsers() {
        try {
            const token = await OAuth2.getToken(); // Get the access token
            logger.info('Listing all users'); // Log listing attempt

            const response = await axios.get(this.apiUrl, {
                headers: {
                    'Authorization': `Bearer ${token.access_token}`,
                    'Content-Type': 'application/scim+json'
                },
            });

            logger.info('Users retrieved successfully: %s', response.data); // Log successful retrieval
            return response.data; // Return the list of users
        } catch (error) {
            logger.error('Error retrieving users: %s', error.response?.data || error.message); // Log error
            throw error; // Re-throw the error for further handling if needed
        }
    }
}

module.exports = new Users(); // Export an instance of the Users class
