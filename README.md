# oci-identity: CLI for Identity Cloud REST APIs

<p align="center">
  <img alt="Dynamic JSON Badge" src="https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fpalmaguer%2Foci-identity-cli%2Frefs%2Fheads%2Fdevelop%2Fpackage.json&query=%24.version&logo=nodedotjs&label=version&labelColor=white&color=gray">
  <img alt="Dynamic JSON Badge" src="https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fpalmaguer%2Foci-identity-cli%2Frefs%2Fheads%2Fdevelop%2Fpackage.json&query=%24.name&logo=npm&logoColor=red&label=package&labelColor=white&color=gray">
  <a src="https://github.com/palmaguer/oci-identity-cli/blob/main/LICENSE.md">
    <img alt="GitHub License" src="https://img.shields.io/github/license/palmaguer/oci-identity-cli?labelColor=white&color=gray">
  </a>
  <img alt="GitHub Open Issues" src="https://img.shields.io/github/issues/palmaguer/oci-identity-cli?labelColor=white&color=lightgray">
  <img alt="GitHub Pull Requests" src="https://img.shields.io/github/issues-pr/palmaguer/oci-identity-cli?labelColor=white&color=lightgray">
</p>

This Node.js application allows you to manage the Identity domain of your Oracle Cloud Infrastructure (OCI) through the command line.
> Work in progress

---

## API Documentation

Detailed documentation for the Users and Groups APIs is available in the `docs` folder:

- [Users API Documentation](./docs/UsersAPI.md): Detailed information on managing users, including searching, creating, retrieving, and deleting users.
- [Groups API Documentation](./docs/GroupsAPI.md): Comprehensive guide for managing groups, including group creation, membership management, and more.

Refer to these files for specific API method usage, SCIM filter examples, and more.

---

## Installation Guide

### Prerequisites:
- **Node.js** (version 12.x or higher)
- **npm**

Verify installation:
```bash
node -v
npm -v
```

### Global Installation:

1. Install from the `main` branch:
   ```bash
   npm install -g git+https://github.com/palmaguer/oci-identity-cli.git
   ```
2. Install from a specific `Release`:
   ```bash
   npm install -g git+https://github.com/palmaguer/oci-identity-cli.git#v1.0.0
   ```

### Verify Installation:

```bash
oci-identity --help
```

### Basic Usage:

- **Authenticate and get a token**:
  ```bash
  oci-identity get-token --envfile ./path/to/envfile.env
  ```

- **Create a new user**:
  ```bash
  oci-identity user-create --envfile ./path/to/envfile.env --userName johndoe --firstName John --lastName Doe --email johndoe@example.com
  ```

- **Search users with filters**:
  ```bash
  oci-identity user-search --envfile ./path/to/envfile.env --filter "userName eq 'johndoe'"
  ```

### Update CLI:
```bash
npm install -g git+https://github.com/palmaguer/oci-identity-cli.git#<branch or tag>
```

---

## Project Structure

```lua
oci-identity-cli/
│
├── src/
│   ├── api/
│   │   ├── users.js
│   │   ├── groups.js
│   │   ├── oauth2.js
│   │   └── index.js
│   │
│   ├── commands/
│   │   ├── auth.js
│   │   ├── groups.js
│   │   ├── program.js
│   │   └── users.js
│   │
│   ├── config/
│   │   ├── config.js
│   │   └── env/
│   │       └── template.env
│   │
│   ├── utils/
│   │   ├── logger.js
│   │   └── jsonUtils.js
│   │
│   └── index.js
│
├── data/
│   └── samples/
│       └── payloads/
├── docs/
│   ├── UsersAPI.md
│   ├── GroupsAPI.md
│   └── SCIM.md
├── scripts/
├── tests/
├── .gitignore
├── package.json
├── README.md
└── LICENSE
```

### Explanation of the Structure

- **`src/api/`**: Contains modules interacting with Oracle Identity Cloud APIs for users, groups, and authentication.
- **`src/commands/`**: CLI logic using Commander.js to define commands like `user-create`, `group-create`, etc.
- **`src/config/`**: Configuration and environment management.
- **`src/utils/`**: Utility functions (logging, request handling).
- **`data/`**: Sample payloads for testing.
- **`docs/`**: Documentation files for the API and SCIM usage.
- **`tests/`**: Contains test cases for the application.
  
---

## Identity Cloud REST API

### Key Endpoints:

- **Users**: `/admin/v1/Users` — Manage user accounts.
- **Groups**: `/admin/v1/Groups` — Manage groups and group memberships.
- **Authentication**: `/oauth2/v1/token` — OAuth2 token retrieval.

### Endpoints Under Development:

- **User Password Management**: `/admin/v1/UserPasswordChanger` — Change or reset user passwords. Useful for scenarios like password recovery or administrative password changes.
- **User Status Management**:   `/admin/v1/UserStatusChanger` — Change the status of a user (e.g., activate or deactivate).
- **Job Scheduling**:           `/job/v1/JobSchedules` — Manage job schedules, such as creating, updating, or monitoring scheduled jobs. This could be used for automating tasks within Oracle Identity Cloud.
- **Authentication**:           `/oauth2/v1/introspect` — Validate and inspect the details of an access token, ensuring it's still valid and contains the expected scopes.

For detailed information, refer to [Oracle Identity Cloud REST API documentation](https://docs.oracle.com/en/cloud/paas/identity-cloud/rest-api/index.html).

---

## Troubleshooting

For further assistance, refer to the `docs/` folder or [open an issue](https://github.com/palmaguer/oci-identity-cli/issues/new/choose).