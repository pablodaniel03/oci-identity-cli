// src/commands/userSearch.js
const { program, programName } = require('./program'); // Import the shared program
const Users = require('../api/users');
const logger = require('../utils/logger');

const name = {
    "getUsers" : 'get-users',
    "getUserBy" : "get-user"
};

program
    .command(`${name.getUsers}`)
    .description('Fetch the complete list of users from your Identity Domain.')
    .action(async () => {
        try {
            logger.debug('Executing list-users command');
            const users = await Users.listUsers();
            console.debug('Users:', users);
        } catch (error) {
            logger.error('Failed to list users:', error.message);
            console.error('Failed to list users:', error.message);
        }
    });

program
    .command(`${name.getUserBy}`)
    .description('Get user details by ID')
    .argument('<userId>', 'Identity Cloud User Identifier')
    //.option('-n, --user-name <userName>', 'Specify this option to search by username instead of id.')
    .action(async (userId) => {
        try {
            logger.debug(`Executing get-user command for user ID: ${userId}`);
            const user = await Users.getUserById(userId);
            console.debug('User Details:', user);
        } catch (error) {
            logger.error(`Failed to get user ${userId}:`, error.message);
            console.error(`Failed to get user ${userId}:`, error.message);
        }
    });


