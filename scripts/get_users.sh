#!/bin/bash

# Check if the environment file is provided
if [ -z "$1" ]; then
    echo "Usage: $0 <envfile> [filter]"
    exit 1
fi

# Define variables
ENV_FILE="$1"  # First argument is the environment file
FILTER="${2:-}"  # Optional second argument is the filter

# List users using your identity-cli program and filter, if provided
echo "Listing users..."
if [ -n "$FILTER" ]; then
    node index.js user-search --filter "$FILTER" --envfile "$ENV_FILE" > users_output.json
else
    node index.js user-search --envfile "$ENV_FILE" > users_output.json
fi

# Check if the user-search command was successful
if [ $? -eq 0 ]; then
    echo "Users listed successfully. Data saved to \"users_output.json.\""

    # Use jq to extract displayName, userName, email, and id
    echo "Extracting user details (displayName, userName, email, id)..."
    jq '.Resources[] | { displayName: .displayName, userName: .userName, email: .emails[0].value, id: .id }' users_output.json
else
    echo "Failed to list users."
    exit 1
fi
