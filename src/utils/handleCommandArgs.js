const os = require('os'); // Import os module for platform detection
const logger = require('./logger');


// Function to format the filter based on the OS
function handleQuoting(argument) {
  const platform = os.platform();
  
  logger.debug({argument}, `hangleQuoting: starting function (os=${platform})`);

  try {
    handledArg = argument.replace(/'/g, '\"');

    if (platform === 'win32') {
      return handledArg.replace(/"/g, '\"'); // For Windows CMD, escape quotes
    } else {
      return handledArg; // For Linux/macOS, normal quoting
    }
  } catch (error) {
    const message = {
      code: "HANDLE_QUOTE_ERR",
      detail: error.message
    };

    logger.error(message, 'handleQuoting: error while replacing quotes.');
    throw message;
  }
}

module.exports = { handleQuoting };