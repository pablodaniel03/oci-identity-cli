#!/usr/bin/env node

// index.js
const { program, programName } = require('./src/commands/program'); // Import the shared program
require('./src/commands/auth'); // Import command modules
require('./src/commands/users'); // Import command modules
require('./src/commands/groups'); // Import command modules

program
    .name(`${programName}`)
    .description('CLI for interacting with Oracle Identity Cloud Service')
    .version('0.3.1', '-v, --version', 'Output the current program version');


program.parse(process.argv);

// If no command is provided, show help
//if (!process.argv.slice(2).length) {
//  program.outputHelp();
//}