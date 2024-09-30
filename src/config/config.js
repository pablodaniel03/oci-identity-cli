// src/config/config.js
const path = require('path');
const dotenv = require('dotenv');
const logger = require('../utils/logger');


class Config {
  // List of supported APIs
  static identityApi = {
                  tokenEndpoint: '/oauth2/v1/token',
                   userEndpoint: '/admin/v1/Users',
                  groupEndpoint: '/admin/v1/Groups',
      userStatusChangerEndpoint: '/admin/v1/UserStatusChanger',
    userPasswordChangerEndpoint: '/admin/v1/UserPasswordChanger',
           jobSchedulesEndpoint: '/job/v1/JobSchedules'
  };

  constructor(envfile) {
    if (envfile != null) {
      // Load environment variables from the envfile provided via command-line argument.
      this.loadEnvironment(envfile);

      // Set configuration properties
      this.identityOAuthConfig = {
          apiBaseUrl: process.env.OCI_IDENTITY_URL,
            clientId: process.env.OCI_OAUTH_CLIENT,
        clientSecret: process.env.OCI_OAUTH_SECRET,
         clientScope: process.env.OCI_OAUTH_SCOPE
      };
      logger.debug('Identity Config: %s', JSON.stringify(this.identityConfig));
    }
  }

  // Method to load environment variables
  loadEnvironment(envfile) {
    // Check if the provided envfile is an absolute path or relative
    const envFilePath = path.isAbsolute(envfile)
                        ? envfile
                        : path.resolve(process.cwd(), envfile); // Use current working directory
    const envFile = dotenv.config({ path: envFilePath });

    if (envFile.error) {
      logger.error(`Error loading environment variables from file "${envFilePath}": "${envFile.error}"`);
      throw envFile.error; // Optionally throw an error to stop execution
    }

    logger.debug(`Loaded environment variables from file "${envFilePath}"`);
  }

  // Method to get the identity configuration
  getIdentityOAuthConfig() {
    return this.identityOAuthConfig;
  }
}

module.exports = Config; // Now export the Config class instead of an instance. So we can provide the envfile.