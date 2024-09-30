// test/idcs.test.js

const axios = require('axios');
const { identityConfig } = require('../src/config/config'); // Ensure this path is correct

// Function to get token from IDCS
async function getToken() {
  const tokenUrl = `${identityConfig.apiBaseUrl}${identityConfig.tokenEndpoint}`;
  const data = new URLSearchParams({
    grant_type: 'client_credentials',
    scope: identityConfig.clientScope,
  });

  const response = await axios.post(tokenUrl, data.toString(),
    {
      auth: {
        username: identityConfig.clientId,
        password: identityConfig.clientSecret
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  );
  return response.data;
}

describe('IDCS Environment Tests', () => {
  it('should retrieve a token from IDCS', async () => {
    const tokenData = await getToken();

    expect(tokenData).toHaveProperty('access_token');
    expect(tokenData).toHaveProperty('expires_in');
    expect(tokenData).toHaveProperty('token_type');
  });

  it('should throw an error for invalid credentials', async () => {
    // Temporarily override the credentials for testing invalid case
    const invalidConfig = {
      ...identityConfig,
      clientId: 'invalid_client_id',
      clientSecret: 'invalid_client_secret',
    };

    // Mocking the axios post method to simulate an error response
    jest.spyOn(axios, 'post').mockImplementation(async () => {
      throw { response: { data: { error: 'invalid_grant' } } };
    });

    await expect(getToken(invalidConfig)).rejects.toEqual({ response: { data: { error: 'invalid_grant' } } });

    // Restore the original implementation
    jest.restoreAllMocks();
  });
});
