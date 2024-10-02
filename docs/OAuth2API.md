# OAuth2 API Documentation

The **OAuth2 API** handles the authentication process for Oracle Identity Cloud, obtaining access tokens required to interact with the system.

## Features:
- **Obtain OAuth2 Access Tokens**: Authenticate using client credentials to retrieve an access token for further API calls.
- **Environment-based Configuration**: Optionally, use environment files to load client credentials.
- **Error Handling**: Provides detailed logging and error messages for troubleshooting.

---

## Methods:

### 1. **Get OAuth2 Token**
Authenticate and retrieve an access token from Oracle Identity Cloud.

#### Method:
```javascript
async getToken(identityUrl, clientId, clientSecret, clientScope)
```

#### Parameters:
- **`identityUrl`**: The URL of your Oracle Identity Cloud instance.
- **`clientId`**: The OAuth2 client ID.
- **`clientSecret`**: The OAuth2 client secret.
- **`clientScope`** (optional): The scope of the OAuth2 client.

#### Example Usage:
```javascript
const oauth2 = new OAuth2('./path/to/envfile');
const token = await oauth2.getToken('https://identity.example.com', 'clientId123', 'secret', 'scope');
console.log(token);
```

#### Error Handling:
Errors in token retrieval (such as invalid credentials or missing parameters) are logged and rethrown for further handling.

---

# Auth Command Documentation

The **Auth Command** provides a command-line interface to obtain an OAuth2 token, supporting both argument-based and environment file-based authentication.

## Command: `get-token`

### Usage:

1. **Using Command-line Arguments**:
   ```bash
   oci-identity get-token --url <identityUrl> --client-id <clientId> --client-secret <clientSecret> [--scope <clientScope>]
   ```

2. **Using an Environment File**:
   ```bash
   oci-identity get-token --file ./path/to/envfile
   ```

### Parameters:
- **`--url`**: The Identity Cloud URL.
- **`--client-id`**: OAuth2 client ID.
- **`--client-secret`**: OAuth2 client secret.
- **`--scope`** (optional): OAuth2 scope.
- **`--file`**: Specify an environment file containing these variables.

### Example Usage:
```bash
oci-identity get-token -u https://identity.example.com -c clientId123 -s secret
```

or

```bash
oci-identity get-token -f ./path/to/envfile
```

### Logging and Debugging:
- Outputs logs to assist in debugging issues like missing parameters or failed token retrieval.
