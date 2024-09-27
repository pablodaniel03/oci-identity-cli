# Command-Line Interface for Identity Cloud REST API

This NodeJs application allows you to manage the Identity domain of your OCI through the Command-Line.
...

> Work in progress

## Project Structure

```lua
oracle-identity-cli/
│
├── src/
│   ├── api/
│   │   ├── users.js
│   │   ├── groups.js
│   │   ├── auth.js
│   │   ├── jobSchedules.js
│   │   └── index.js
│   │
│   ├── commands/
│   │   ├── userCommands.js
│   │   ├── groupCommands.js
│   │   ├── authCommands.js
│   │   ├── jobScheduleCommands.js
│   │   └── index.js
│   │
│   ├── config/
│   │   └── config.js
│   │
│   ├── utils/
│   │   ├── logger.js
│   │   └── requestHandler.js
│   │
│   └── index.js
│
├── .gitignore
├── package.json
├── README.md
└── LICENSE
```

### Explanation of the Structure

- `src/`: <small>The main source code folder.</small>
  - `api/`: <small>Contains modules that interact with the Oracle Identity Cloud APIs. Each file corresponds to a specific API group (e.g.,  - users, groups, authentication).</small>
    - `users.js`: <small>Handles API requests related to users.</small>
    - `groups.js`: <small>Handles API requests related to groups.</small>
    - `auth.js`: <small>Handles API requests for authentication (e.g., token generation).</small>
    - `jobSchedules.js`: <small>Handles API requests related to job scheduling.</small>
    - `index.js`: <small>Optionally, an index file to export all API modules together for easier import.</small>
- `commands/`: <small>Contains CLI command logic, possibly using Commander.js and Inquirer.js.</small>
  - `userCommands.js`: <small>Defines CLI commands for user-related operations.</small>
  - `groupCommands.js`: <small>Defines CLI commands for group-related operations.</small>
  - `authCommands.js`: <small>Defines CLI commands for authentication.</small>
  - `jobScheduleCommands.js`: <small>Defines CLI commands for job scheduling.</small>
  - `index.js`: <small>Optionally, an index file to combine all CLI commands.</small>
- `config/`: <small>Configuration files, such as API base URLs, environment variables, etc.</small>
  - `config.js`: <small>Manages configurations like API endpoints, credentials, and other settings.</small>
- `utils/`: <small>Utility functions that can be reused across the project.</small>
  - `logger.js`: <small>Custom logging utility for consistent logging across the application.</small>
  - `requestHandler.js`: <small>A utility for handling Axios requests, including error handling and response formatting.</small>
- `index.js`: <small>The entry point of your CLI application. This file can initialize the CLI commands using Commander.js.</small>
- `.gitignore`: <small>Specifies which files and directories Git should ignore (e.g., node_modules/, .env files).</small>
- `package.json`: <small>Contains metadata about the project, including dependencies, scripts, and basic information.</small>
- `README.md`: <small>A markdown file providing an overview of the project, how to install and use it, and any other relevant documentation.</small>
- `LICENSE`: <small>License information for your project.</small>


---

## Identity Cloud REST API

Below the list of the used endpoints:

* **Users**
  `/admin/v1/Users`: <small>Manage user accounts, including retrieving, creating, updating, and deleting users.</small>

* **User Password Management**
  
  `/admin/v1/UserPasswordChanger`: <small>Change or reset user passwords. Useful for scenarios like password recovery or administrative password changes.</small>

* **User Status Management**
  
  `/admin/v1/UserStatusChanger`: <small>Change the status of a user (e.g., activate, deactivate). This can be important for managing user access.</small>

* **Groups**
  
  `/admin/v1/Groups`: <small>Manage groups, including adding/removing users from groups and retrieving group details.</small>

* **Authentication**
  
  `/oauth2/v1/token`: <small>Obtain an OAuth2 access token for authenticating subsequent API requests.</small>
  `/oauth2/v1/introspect`: <small>Validate and inspect the details of an access token, ensuring it's still valid and contains the expected scopes.</small>

* **Job Scheduling**
  
  `/job/v1/JobSchedules`: <small>Manage job schedules, such as creating, updating, or monitoring scheduled jobs. This could be used for automating tasks within Oracle Identity Cloud.</small>

For detailed documentation and a complete list of API endpoints, you can refer to the [Oracle Identity Cloud REST API documentation](https://docs.oracle.com/en/cloud/paas/identity-cloud/rest-api/index.html).
