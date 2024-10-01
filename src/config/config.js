// src/config/config.js
const path = require('path');
const dotenv = require('dotenv');
const logger = require('../utils/logger');

// Standard error messages with error codes
const ERROR = {
  MISSING_ENVFILE: { message: 'No environment file specified or invalid format.', code: 'ERR_MISSING_ENVFILE' },
  DOTENV_ERROR: { message: 'Error loading environment variables from file:', code: 'ERR_DOTENV_ERROR' }
};

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
    if (envfile) {
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
    // Resolve relative paths and check if the provided envfile exists
    const file = path.isAbsolute(envfile)
      ? envfile
      : path.resolve(process.cwd(), envfile); // Use current working directory

    // Load the environment variables from the specified file
    const environment = dotenv.config({ path: file });

    // If loading environment variables failed or file does not exist, handle the error
    if (environment.error) {
      logger.error(`Error loading environment variables from file "${file}": ${environment.error.message}`);
      const error = new Error(`${ERROR.DOTENV_ERROR.message} ${file}`);
      error.code = ERROR.DOTENV_ERROR.code;
      throw error;
    }

    logger.debug(`Loaded environment variables from file "${file}"`);
  }

  // Method to get the identity configuration
  getIdentityOAuthConfig() {
    return this.identityOAuthConfig;
  }
}

module.exports = Config; // Now export the Config class instead of an instance so we can provide the envfile.