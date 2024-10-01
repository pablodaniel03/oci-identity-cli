const { inspect } = require('util'); // Use util.inspect for colorizing

// Function to parse and colorize JSON
function printPrettyJson(input) {
  try {
    const parsed = JSON.parse(input);

    if (process.stdout.isTTY) {
      // If running in a terminal, print with colors
      console.log(inspect(parsed, { colors: true, depth: null, maxArrayLength: Infinity }));
    } else {
      // Otherwise, print formatted JSON
      console.log(JSON.stringify(parsed, undefined, 2));
    }
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

module.exports = { printPrettyJson };
