// src/commands/auth.js
const { program, programName } = require('./program'); // Import the shared program
const { printPrettyJson, logger } = require('../utils'); // Import all utils from index.js
const OAuth2 = require('../api/oauth2');

const name = 'get-token';
program
    .command(`${name}`)
    .description('Obtain an access OAuth2 token from your Identity Cloud.')
    .option('-u, --url            <identityUrl>', 'Specify your Identity Cloud URL (required, using arguments.')
    .option('-c, --client-id      <clientId>', 'Specify the client ID (required, using arguments).')
    .option('-s, --client-secret  <clientSecret>', 'Specify the client secret (required, using arguments).')
    .option('    --scope          <clientScope>', 'Specify the client scope (optional, using arguments).')
    .option('-f, --file           <environment-file>', 'Specify a *.env file with yours variables (See README for more details).')
    .helpOption('-h, --help', 'Display help for the get-token command.')
    .addHelpText('after', `
Note: Ensure that the provided environment file is correctly formatted and contains all necessary variables for successful authentication.


Examples:
  $ ${programName} ${name} -u <identityUrl> -c <clientId> -s <clientSecret> [--scope <clientScope>]
  $ ${programName} ${name} --url <identityUrl> --client-id <clientId> --client-secret <clientSecret> [--scope <clientScope>]
  
  $ ${programName} ${name} -f <environment-file>
  $ ${programName} ${name} --file <environment-file>

This command will obtain an access token needed for accessing the Oracle Identity Cloud services.
`)
    .action(async (options) => {
        try {
            logger.debug(`Starting "${programName} ${name}" command.`);
            logger.debug('options: %o', options);

            const { file, url, clientId, clientSecret, scope } = options;

            if (!file && (!url || !clientId || !clientSecret)) {
                console.log('---------------------');
                logger.trace('Error: Missing required parameters. Please provide identityUrl, clientId, and clientSecret.');
                console.error(`Missing required parameters. Use "${programName} ${name} --help" for more information.`);
                console.log('---------------------\n\n');

                program.outputHelp();
                return;
            }
            
            // Instantiate OAuth2 with the environment file
            const oauth2 = new OAuth2(file);
            logger.debug('Initializing OAuth2 with environment file: "%s"', file);

            // Retrieve the access token
            logger.debug('Requesting access token...');
            const token = await oauth2.getToken(url, clientId, clientSecret, scope);

            // Successfully received token
            logger.debug('Access Token received successfully.');
            // Parse and colorize the JSON output
            printPrettyJson(JSON.stringify(token));
            // console.log(JSON.stringify(users, null, 2));
            //console.log(JSON.stringify(token));

        } catch (error) {
            const errorMessage = error.response?.data || error.message;
            logger.error('Failed to get access token: "%s"', errorMessage);
            console.error('Failed to get access token: "%s"', errorMessage);
        }
    });
