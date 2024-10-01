const fs = require('fs');
const { printPrettyJson, logger } = require('../utils'); // Import all utils from index.js
const { program, programName } = require('./program'); // Import the shared program
const Users = require('../api/users');

// Command to list users
program
  .command('user-search')
  .description('Search users or filter users using a SCIM query')
  .requiredOption('-e, --envfile <envfile>', 'Specify the environment file (required)')
  .option('-f, --filter <filter>', 'Filter users by a SCIM query (optional)')
  .action(async (options) => {
    try {
      const { envfile, filter } = options;

      const usersApi = new Users(envfile);
      const users = await usersApi.search(filter);


      // Parse and colorize the JSON output
      printPrettyJson(JSON.stringify(users));
      // console.log(JSON.stringify(users, null, 2));
    } catch (error) {
      logger.error('Error listing users: %s', error.message);
      console.error('Error:', error.message);
    }
  })
  .addHelpText('after', `
  -----
   SCIM Filter Syntax

     Basic Filter Expression:
       attribute operator value

     Common Operators:
       eq : "Equals"
       co : "Contains (substring match)"
       sw : "Starts with"
       pr : "Present (attribute is defined)"
       gt : "Greater than"
       lt : "Less than"
       ge : "Greater than or equal to"
       le : "Less than or equal to"
       ne : "Not equal to"
     
       - "userName eq 'johndoe'"
       - "displayName co 'John'"
       - "active eq true"
       - "emails.value eq 'johndoe@example.com'"
       - "meta.lastModified gt '2024-01-01T00:00:00Z'"
       - "userName eq 'johndoe' and active eq true"
       
     Refer to the SCIM specification for detailed information on filtering.
  -----

Examples:
  $ ${programName} user-search -e <environment-file>
  $ ${programName} user-search --envfile <environment-file>

  $ ${programName} user-search -e <environment-file> -f <scim-query-filter>
  $ ${programName} user-search --envfile <environment-file> --filter <scim-query-filter>

  $ ${programName} user-search --envfile /path/to/environment-file.env
  $ ${programName} user-search --envfile /path/to/environment-file.env --filter "userName eq 'johndoe'"
  $ ${programName} user-search --envfile /path/to/environment-file.env --filter "userName eq 'johndoe'" | jq '.Resources[] | {id: .id, userName: .userName, email: .emails[0].value}'

  `);


// Command to get user by ID
program
  .command('user-get')
  .description('Get details of a user by their ID')
  .argument('<userId>', 'Identity User Identifier.')
  .requiredOption('-e, --envfile <envfile>', 'Specify the environment file (required)')
  .action(async (userId, options) => {
    try {
      const { envfile } = options;

      const usersApi = new Users(envfile);
      const user = await usersApi.getUserById(userId);

      // Parse and colorize the JSON output
      printPrettyJson(JSON.stringify(user));
      // console.log(JSON.stringify(user, null, 2));
    } catch (error) {
      logger.error('Error fetching user details: %s', error.message);
      console.error('Error:', error.message);
    }
  })
  .addHelpText('after', `
Examples:
  $ ${programName} user-get <userId> -e <environment-file>
  $ ${programName} user-get <userId> --envfile <environment-file>

  $ ${programName} user-get "34e4f6ba33e04d9ca79" -e /path/to/environment-file.env
  $ ${programName} user-get "34e4f6ba33e04d9ca79" --envfile /path/to/environment-file.env

  $ ${programName} user-get "34e4f6ba33e04d9ca79" --envfile /path/to/environment-file.env | jq '.userName'
  $ ${programName} user-get "34e4f6ba33e04d9ca79" --envfile /path/to/environment-file.env | jq '{userName: .userName, email: .emails[0].value }'

`);

// Command to create a new user
program
  .command('user-create')
  .description('Create a new user in Oracle Identity Cloud')
  .requiredOption('-e, --envfile <envfile>', 'Specify the environment file (required)')
  .option('-p, --payload <payload>', 'Specify a JSON file containing the user details')
  .option('-u, --userName <userName>', 'Specify the user name')
  .option('-f, --firstName <firstName>', 'Specify the first name of the user')
  .option('-l, --lastName <lastName>', 'Specify the last name of the user')
  .option('-m, --email <email>', 'Specify the email of the user')
  .option('-a, --active', 'Set the user as active', true)
  .action(async (options) => {
    try {
      const { envfile, payload, userName, firstName, lastName, email, active } = options;
      let data;

      if (payload) {
        // Load user details from the payload JSON file
        const fileContent = fs.readFileSync(payload, 'utf-8');
        data = JSON.parse(fileContent);
        logger.debug('User data loaded from payload file: %s', payload);
      } else {
        // Create user data from command-line arguments
        data = {
          schemas: ["urn:ietf:params:scim:schemas:core:2.0:User"],
          userName: userName,
          name: {
            givenName: firstName,
            familyName: lastName
          },
          emails: [
            {
              value: email,
              type: 'work',
              primary: true
            }
          ],
          active: active
        };
      }

      // Create the user using Users API
      const usersApi = new Users(envfile);
      const user = await usersApi.createUser(data);

      // Parse and colorize the JSON output
      printPrettyJson(JSON.stringify(user));
      // console.log(JSON.stringify(user, null, 2));    
    } catch (error) {
      logger.error('Error creating user: %s', error.message);
      console.error('Error creating user:', error.message);
    }
  })
  .addHelpText('after', `
Examples:
  $ ${programName} user-create -e <environment-file> --userName johndoe --firstName John --lastName Doe --email johndoe@example.com --active
  $ ${programName} user-create -e /path/to/envfile --userName johndoe --firstName John --lastName Doe --email johndoe@example.com
  $ ${programName} user-create -e /path/to/envfile --payload /path/to/user-payload.json
`);
