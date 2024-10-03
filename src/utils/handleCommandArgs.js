const os = require('os'); // Import os module for platform detection

// Function to format the filter based on the OS
function handleQuoting(argument) {
  const platform = os.platform();

  handledArg = argument.replace(/'/g, '\"');

  if (platform === 'win32') {
    // For Windows CMD, escape quotes
    return handledArg.replace(/"/g, '\"');
  } else {
    // For Linux/macOS, normal quoting
    return handledArg;
  }
}

module.exports = { handleQuoting };