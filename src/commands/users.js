const fs = require('fs');
const { printPrettyJson, logger } = require('../utils'); // Import all utils from index.js
const { program, programName } = require('./program'); // Import the shared program
const Users = require('../api/users');

// Command to list users
program
  .command('user-search')
  .description('Search users or filter users using a SCIM query')
  .requiredOption('-e, --envfile <envfile>', 'Specify the environment file (required)')
  .option('-f, --filter <filter>', 'A filter string that specifies the search criteria for users. (optional)')
  .option('--attributes <attributes>', 'A comma-delimited string that specifies the names of resource attributes that should be returned in the response. (optional)')
  .option('--count <number-of-records>', 'An integer that indicates the desired maximum number of query results per page. 1000 is the largest value that you can use. (optional)')
  .option('--sortBy <sort>', 'A string that indicates the attribute whose value SHALL be used to order the returned responses. The sortBy attribute MUST be in standard attribute notation form. (optional)')
  .option('--sortOrder <order>', 'A string that indicates the order in which the sortBy parameter is applied. Allowed values are \'ascending\' and \'descending\'. (optional)')
  .option('--startIndex <index-page>', 'An integer that indicates the 1-based index of the first query result. (optional)')
  .action(async (options) => {
    try {
      const { envfile, filter, attributes, count, sortBy, sortOrder, startIndex } = options;

      // Build query parameters dynamically, excluding undefined or empty values
      const queryParams = {
        filter,
        attributes,
        count,
        sortBy,
        sortOrder,
        startIndex
      };

      // Filter out undefined or empty query parameters
      const validQueryParams = Object.fromEntries(Object.entries(queryParams).filter(([key, value]) => value !== undefined && value !== ''));

      const usersApi = new Users(envfile);
      const users = await usersApi.search(validQueryParams);


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

  Basic usage:
    $ ${programName} user-search -e /path/to/envfile

  Filter by 'displayName':
    $ ${programName} user-search --envfile /path/to/envfile --filter "displayName eq 'John'"

  Fetch specific attributes:
    $ ${programName} user-search --envfile /path/to/envfile --attributes "id,displayName"

  Paginate results (limit to 100 results):
    $ ${programName} user-search --envfile /path/to/envfile --count 100

  Paginate and fetch results starting from the second page:
    $ ${programName} user-search --envfile /path/to/envfile --count 100 --startIndex 101

  Sort results by 'displayName' in ascending order:
    $ ${programName} user-search --envfile /path/to/envfile --sortBy displayName --sortOrder ascending

  Combine filter, attributes, and sorting:
    $ ${programName} user-search --envfile /path/to/envfile --filter "displayName eq 'John'" --attributes "id,displayName" --sortBy displayName --sortOrder ascending --count 100

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
      //const user = await usersApi.getUserById(userId); // TODO: getGroupById is deprecated.
      const user = await usersApi.search({filter: `id eq "${userId}"`})

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

// Command to delete a user
program
  .command('user-delete')
  .description('Delete a user in Oracle Identity Cloud by userId')
  .argument('<userId>', 'Identity User Identifier.')
  .requiredOption('-e, --envfile <envfile>', 'Specify the environment file (required)')
  .action(async (userId, options) => {
    try {
      const { envfile } = options;

      // Initialize Users API with the environment file
      const usersApi = new Users(envfile);

      // Call the deleteUser method to delete the user by userId
      const result = await usersApi.deleteUser(userId);

      if(result || result == '' || result.status == "204"){
        logger.debug(`User with ID "${userId}" deleted successfully.`);
        printPrettyJson(JSON.stringify({"status": "success"}));
      }

      // Log the success message
      
    } catch (error) {
      // Log and print error if user deletion fails
      logger.error('Failed to delete user: %s', error.message);
      console.error(error.response?.data.detail || error.message);
    }
   })
  .addHelpText('after', `
Examples:
  $ ${programName} user-delete <userId> -e <environment-file>
  $ ${programName} user-delete <userId> --envfile <environment-file>

`);

