// src/config/config.js
const path = require('path');
const dotenv = require('dotenv');
const logger = require('../utils/logger');

// Function to load the environment variables based on the environment argument
function loadEnv(env) {
    const envFilePath = path.resolve(__dirname, './env', `${env}.env`); // Adjusted path to point to /env
    const envFile = dotenv.config({ path: envFilePath });

    if (envFile.error) {
      logger.error(`Error loading environment variables from ${envFilePath}:`, envFile.error);
      throw envFile.error; // Optionally throw an error to stop execution
    }
    
    logger.debug(`Loaded environment variables from ${envFilePath}`);
}

// Read the environment argument passed to the script
const environment = process.env.ENVIRONMENT || 'development'; // process.argv[2] || Default to 'development'
loadEnv(environment);

// Configuration object
const identityConfig = {
    apiBaseUrl: process.env.OCI_IDENTITY_URL,
    clientId: process.env.OCI_OAUTH_CLIENT,
    clientSecret: process.env.OCI_OAUTH_SECRET,
    clientScope: process.env.OCI_OAUTH_SCOPE,
    tokenEndpoint: '/oauth2/v1/token',
    userEndpoint: '/admin/v1/Users',
    groupEndpoint: '/admin/v1/Groups',
    userStatusChangerEndpoint: '/admin/v1/UserStatusChanger',
    userPasswordChangerEndpoint: '/admin/v1/UserPasswordChanger',
    jobSchedulesEndpoint: '/job/v1/JobSchedules',
};

logger.debug('Identity Config: %s', JSON.stringify(identityConfig));

module.exports = {
  identityConfig
};
