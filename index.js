// index.js
const { program, programName } = require('./src/commands/program'); // Import the shared program
require('./src/commands/auth'); // Import command modules
require('./src/commands/userSearch'); // Import command modules

program
    .name(`${programName}`)
    .description('CLI for interacting with Oracle Identity Cloud Service')
    .version('1.0.0', '-v, --version', 'Output the current program version');

// Add a general help command
// program
//     .command('help')
//     .description('Display help for available commands')
//     .action(() => {
//         console.log(`
// Available Commands:
//   auth [command]         Commands related to authentication
//   userSearch [command]   Commands related to user management

// Commands for 'auth':
//   obtain-token           Obtain an access token

// Commands for 'userSearch':
//   list                  List all users
//   get <userId>         Get user by ID

// Use 'node src/index.js [command] --help' for more information about a specific command.
//         `);
//     });


program.parse(process.argv);

// If no command is provided, show help
//if (!process.argv.slice(2).length) {
//  program.outputHelp();
//}