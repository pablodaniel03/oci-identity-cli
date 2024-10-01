const { program, programName } = require('./program'); // Import the shared program
const Users = require('../api/users');
const logger = require('../utils/logger');


// Command to list users
program
  .command('user-search')
  .description('Search users or filter users using a SCIM query')
  .requiredOption('-e, --envfile <envfile>', 'Specify the environment file (required)')
  .option('-f, --filter <filter>', 'Filter users by a SCIM query (optional)')
  .action(async (options) => {
    try {
      const {envfile, filter} = options;

      const usersApi = new Users(envfile);
      const data = await usersApi.search(filter);

      console.log(JSON.stringify(data));
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
      const {envfile} = options;
  
      const usersApi = new Users(envfile);
      const data = await usersApi.getUserById(userId);

      console.log(JSON.stringify(data));
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
