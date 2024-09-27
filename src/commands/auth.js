// src/commands/auth.js
const { program, programName } = require('./program'); // Import the shared program
const OAuth2 = require('../api/oauth2');
const logger = require('../utils/logger');

const name = 'get-token';
program
    .command(`${name}`)
    .description('Obtain an access OAuth2 token from your Identity Cloud.')
    .option('-c, --client-id <clientId>', 'Specify the client ID (optional)')
    .option('-s, --client-secret <clientSecret>', 'Specify the client secret (optional)')
    .option('--scope <clientScope>', 'Specify the client scope (optional)')
    .helpOption('-h, --help', 'Display help for the get-token command')
    .addHelpText('after', `

Examples:
  $ ${programName} ${name} [-c <clientId>] [-s <clientSecret>] [--scope <clientScope>]
  $ ${programName} ${name} [--client-id <clientId>] [--client-secret <clientSecret>] [--scope <clientScope>]
  
This command will obtain an access token needed for accessing the Oracle Identity Cloud services.
`)
    .action(async (options) => {
        try {
            logger.debug('Executing get-token command');
            const tokenData = await OAuth2.getToken(options.clientId, options.clientSecret, options.clientScope);
            logger.debug('Access Token:', tokenData.access_token);
            console.debug('Access Token:', tokenData.access_token);
        } catch (error) {
            logger.error('Failed to get access token:', error.response?.data || error.message);
            console.error('Failed to get access token:', error.message);
        }
    });

