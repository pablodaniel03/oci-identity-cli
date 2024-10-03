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
    .option('-e, --envfile        <environment-file>', 'Specify a *.env file with yours variables (See README for more details).')
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
            const { envfile, url, clientId, clientSecret, scope } = options;

            logger.debug({options}, "get-token: command-line arguments");

            if (!envfile && (!url || !clientId || !clientSecret)) {
                console.log('---------------------');
                logger.error('get-token: missing required parameters. Please provide identityUrl, clientId, and clientSecret.');
                console.error(`Missing required parameters. Use "${programName} ${name} --help" for more information.`);
                console.log('---------------------\n\n');

                program.outputHelp();
                return;
            }
            
            // Instantiate OAuth2 with the environment file
            const oauth2 = new OAuth2(envfile);
            logger.trace('get-token: OAuth2 instantiated.');

            // Retrieve the access token
            const token = await oauth2.getToken(url, clientId, clientSecret, scope);
            logger.trace('get-token: oauth2 token retrieved.');

            // Parse and colorize the JSON output
            printPrettyJson(JSON.stringify(token));
        } catch (error) {
            console.error('Error:', error.detail);
        }
    });
