// src/utils/logger.js
const pino = require('pino');

// Initialize Pino logger
const logger = pino({
    level: process.env.LOG_LEVEL || 'fatal', // Set log level from env or default to 'info'
    transport: {
        target: 'pino-pretty', // Pretty print for console output
        options: {
            colorize: true // Add color to console output
        }
    }
});

module.exports = logger;