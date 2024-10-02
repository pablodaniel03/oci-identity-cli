const fs = require('fs');
const { program, programName } = require('./program'); // Shared program base
const { printPrettyJson, logger } = require('../utils'); // Reuse utilities
const Groups = require('../api/groups'); // Groups API

// Command to search (list) groups with optional filtering
program
  .command('group-search')
  .description('Search groups or filter groups using a query')
  .requiredOption('-e, --envfile <envfile>', 'Specify the environment file (required)')
  .option('-f, --filter <filter>', 'A comma-delimited string that specifies the names of resource attributes that should be returned in the response. (optional)')
  .option('    --attributes <attributes>', 'A comma-delimited string that specifies the names of resource attributes that should be returned in the response. (optional)')
  .option('    --count <number-of-records>', 'An integer that indicates the desired maximum number of query results per page. 1000 is the largest value that you can use. (optional)')
  .option('    --sortBy <sort>', 'A string that indicates the attribute whose value SHALL be used to order the returned responses. The sortBy attribute MUST be in standard attribute notation form. (optional)')
  .option('    --sortOrder <order>', 'A string that indicates the order in which the sortBy parameter is applied. Allowed values are \'ascending\' and \'descending\'. (optional)')
  .option('    --startIndex <index-page>', 'An integer that indicates the 1-based index of the first query result.. (optional)')
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

      const groupsApi = new Groups(envfile); // Instantiate the Groups API class
      const groups = await groupsApi.search(validQueryParams);

      printPrettyJson(JSON.stringify(groups)); // Print formatted output
    } catch (error) {
      logger.error('Error searching groups: %s', error.message);
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
    $ ${programName} group-search -e /path/to/envfile

  Filter by 'displayName':
    $ ${programName} group-search --envfile /path/to/envfile --filter "displayName eq 'Admin'"

  Fetch specific attributes:
    $ ${programName} group-search --envfile /path/to/envfile --attributes "id,displayName"

  Paginate results (limit to 100 results):
    $ ${programName} group-search --envfile /path/to/envfile --count 100

  Paginate and fetch results starting from the second page:
    $ ${programName} group-search --envfile /path/to/envfile --count 100 --startIndex 101

  Sort results by 'displayName' in ascending order:
    $ ${programName} group-search --envfile /path/to/envfile --sortBy displayName --sortOrder ascending

  Combine filter, attributes, and sorting:
    $ ${programName} group-search --envfile /path/to/envfile --filter "displayName eq 'Admin'" --attributes "id,displayName" --sortBy displayName --sortOrder ascending --count 100

`);

// Command to get group details by ID
program
  .command('group-get <groupId>')
  .description('Get details of a specific group by ID')
  .requiredOption('-e, --envfile <envfile>', 'Specify the environment file (required)')
  .action(async (groupId, options) => {
    try {
      const { envfile } = options;
      const groupsApi = new Groups(envfile); // Instantiate the Groups API class
      
      //const group = await groupsApi.getGroupById(groupId); // TODO: getGroupById is deprecated.
      const group = await groupsApi.search({filter: `id eq "${groupId}"`})

      printPrettyJson(JSON.stringify(group)); // Print formatted output
    } catch (error) {
      logger.error('Error fetching group details: %s', error.message);
      console.error('Error:', error.message);
    }
  })
  .addHelpText('after', `
Examples:
  $ ${programName} group-get <groupId> -e /path/to/envfile
  $ ${programName} group-get "12345" --envfile /path/to/envfile
`);

// Command to create a new group
program
  .command('group-create')
  .description('Create a new group in Oracle Identity Cloud')
  .requiredOption('-e, --envfile <envfile>', 'Specify the environment file (required)')
  .option('-p, --payload <payload>', 'Specify a JSON file containing the group details')
  .option('-n, --groupName <groupName>', 'Specify the group name')
  .option('-d, --description <description>', 'Specify the group description')
  .option('-m, --members <members>', 'Specify user members as a JSON array or a single user ID')
  .action(async (options) => {
    try {
      const { envfile, payload, groupName, description, members } = options;
      let data;

      // Load group details from the payload file if provided
      if (payload) {
        const fileContent = fs.readFileSync(payload, 'utf-8');
        data = JSON.parse(fileContent);
        logger.debug('Group data loaded from payload file: %s', payload);
      } else {
        // Create group data from command-line arguments
        data = {
          displayName: groupName,
          externalId: "123456", // Placeholder for external ID; adjust as needed
          schemas: [
            "urn:ietf:params:scim:schemas:core:2.0:Group",
            "urn:ietf:params:scim:schemas:oracle:idcs:extension:group:Group",
            "urn:ietf:params:scim:schemas:extension:custom:2.0:Group"
          ],
          "urn:ietf:params:scim:schemas:oracle:idcs:extension:group:Group": {
            creationMechanism: "api",
            description: description
          }
        };

        // Add members if the --members option is provided
        if (members) {
          let membersArray;

          // Check if members is a valid JSON array or a single string
          try {
            membersArray = JSON.parse(members);
            if (!Array.isArray(membersArray)) {
              throw new Error('Members must be a valid JSON array or a single user ID');
            }
          } catch (error) {
            // If it's a single user ID, convert it into an array
            membersArray = [members];
          }

          // Add members to the data structure
          data.members = membersArray.map(userId => ({
            value: userId,
            type: "User"
          }));
        }
      }

      // Create the group using Groups API
      const groupsApi = new Groups(envfile);
      const group = await groupsApi.createGroup(data);

      // Parse and colorize the JSON output
      printPrettyJson(JSON.stringify(group));
    } catch (error) {
      logger.error('Error creating group: %s', error.message);
      console.error('Error creating group:', error.message);
    }
  })
  .addHelpText('after', `
Examples:
  $ ${programName} group-create -e /path/to/envfile --groupName "Developers" --description "Development team"
  $ ${programName} group-create -e /path/to/envfile --payload /path/to/group-payload.json
  $ ${programName} group-create -e /path/to/envfile --groupName "Developers" --description "Development team" --members '["userid1", "userid2"]'
  $ ${programName} group-create -e /path/to/envfile --groupName "Developers" --description "Development team" --members "userid"
`);

// Command to add members to a group
program
  .command('group-add-members')
  .description('Add members to a group in Oracle Identity Cloud')
  .argument('<groupId>', 'Identity Group Identifier.')
  .requiredOption('-e, --envfile <envfile>', 'Specify the environment file (required)')
  .requiredOption('-m, --members <members>', 'Specify the members to add as a JSON array or comma-separated list of user IDs')
  .action(async (groupId, options) => {
    try {
      const { envfile, members } = options;
      const membersArray = Array.isArray(members) ? members : members.split(',');

      // Construct the PATCH payload
      const patchData = {
        schemas: ["urn:ietf:params:scim:api:messages:2.0:PatchOp"],
        Operations: [
          {
            op: "add",
            path: "members",
            value: membersArray.map(userId => ({ value: userId, type: "User" }))
          }
        ]
      };

      const groupsApi = new Groups(envfile); // Instantiate the Groups API class
      const result = await groupsApi.patchGroup(groupId, patchData);

      printPrettyJson(JSON.stringify(result));
      logger.info(`Successfully added members to group ${groupId}`);
    } catch (error) {
      logger.error(`Error adding members to group: ${error.message}`);
      console.error('Error adding members:', error.message);
    }
  })
  .addHelpText('after', `
Examples:
  $ ${programName} group-add-members <groupId> -e /path/to/envfile --members '["userid1", "userid2"]'
  $ ${programName} group-add-members <groupId> -e /path/to/envfile --members userid1,userid2
`);

// Command to remove members from a group
program
  .command('group-remove-members')
  .description('Remove members from a group in Oracle Identity Cloud')
  .argument('<groupId>', 'Identity Group Identifier.')
  .requiredOption('-e, --envfile <envfile>', 'Specify the environment file (required)')
  .requiredOption('-m, --members <members>', 'Specify the members to remove as a JSON array or comma-separated list of user IDs')
  .action(async (groupId, options) => {
    try {
      const { envfile, members } = options;
      const membersArray = Array.isArray(members) ? members : members.split(',');

      // Construct the PATCH payload
      const patchData = {
        schemas: ["urn:ietf:params:scim:api:messages:2.0:PatchOp"],
        Operations: membersArray.map(userId => ({
          op: "remove",
          path: `members[value eq "${userId}"]`
        }))
      };

      const groupsApi = new Groups(envfile); // Instantiate the Groups API class
      const result = await groupsApi.patchGroup(groupId, patchData);

      printPrettyJson(JSON.stringify(result));
      logger.info(`Successfully removed members from group ${groupId}`);
    } catch (error) {
      logger.error(`Error removing members from group: ${error.message}`);
      console.error('Error removing members:', error.message);
    }
  })
  .addHelpText('after', `
Examples:
  $ ${programName} group-remove-members <groupId> -e /path/to/envfile --members '["userid1", "userid2"]'
  $ ${programName} group-remove-members <groupId> -e /path/to/envfile --members userid1,userid2
`);

// Command to delete a group by ID
program
  .command('group-delete')
  .description('Delete a group by its ID in Oracle Identity Cloud')
  .argument('<groupId>', 'Identity Group Identifier.')
  .requiredOption('-e, --envfile <envfile>', 'Specify the environment file (required)')
  .action(async (groupId, options) => {
    try {
      const { envfile } = options;

      const groupsApi = new Groups(envfile); // Instantiate the Groups API class
      const result = await groupsApi.deleteGroup(groupId);

      if (result == '' || result.status == "204") {
        logger.debug(`Group with ID "${groupId}" deleted successfully.`);
        printPrettyJson(JSON.stringify({ "status": "success" }));
      }
    } catch (error) {
      logger.error('Error deleting group: %s', error.message);
      console.error('Error:', error.message);
    }
  })
  .addHelpText('after', `
Examples:
  $ ${programName} group-delete <groupId> -e /path/to/envfile
  $ ${programName} group-delete "12345" --envfile /path/to/envfile
`);

module.exports = program;
