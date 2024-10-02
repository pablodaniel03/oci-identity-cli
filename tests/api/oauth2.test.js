// src/api/oauth2.test.js
const Config = require('../../src/config/config');
const OAuth2 = require('../../src/api/oauth2'); // Correct import path
const axios = require('axios');

jest.mock('axios'); // Automatically mocks axios

// Before each test, create a new instance and reset axios mocks
beforeEach(() => {
  jest.clearAllMocks();  // Clears mock history for all mock functions
});

describe('OAuth2 API', () => {
  const testenv = 'tests/test.env';

  test('should successfully retrieve an access token using env file', async () => {
    const oauth2 = new OAuth2(testenv);

    // Mock the successful API response
    const mockTokenResponse = {
      data: {
        access_token: 'mocked_access_token',
        token_type: 'Bearer',
        expires_in: 3600
      }
    };

    axios.post.mockResolvedValueOnce(mockTokenResponse);

    // Getting token without providing parameters.
    const tokenData = await oauth2.getToken();

    expect(tokenData).toHaveProperty('access_token', 'mocked_access_token');
    expect(tokenData).toHaveProperty('token_type', 'Bearer');
    expect(tokenData).toHaveProperty('expires_in', 3600);

    expect(axios.post).toHaveBeenCalledWith(
      'https://idc-xxxxxxxxx.identity.oraclecloud.com' + Config.identityApi.tokenEndpoint,
      'grant_type=client_credentials&scope=mock_client_scope',
      {
        auth: {
          username: 'mock_client_id',
          password: 'mock_client_secret'
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
  });

  test('should successfully retrieve an access token using command-line arguments', async () => {
    const oauth2 = new OAuth2();

    // Mock the successful API response
    const mockTokenResponse = {
      data: {
        access_token: 'mocked_access_token',
        token_type: 'Bearer',
        expires_in: 3600
      }
    };

    axios.post.mockResolvedValueOnce(mockTokenResponse);

    // Getting token without providing parameters.
    const tokenData = await oauth2.getToken(
      'https://idc-xxxxxxxxx.identity.oraclecloud.com',
      'mock_client_id',
      'mock_client_secret',
      'mock_client_scope'
    );

    expect(tokenData).toHaveProperty('access_token', 'mocked_access_token');
    expect(tokenData).toHaveProperty('token_type', 'Bearer');
    expect(tokenData).toHaveProperty('expires_in', 3600);

    expect(axios.post).toHaveBeenCalledWith(
      'https://idc-xxxxxxxxx.identity.oraclecloud.com' + Config.identityApi.tokenEndpoint,
      'grant_type=client_credentials&scope=mock_client_scope',
      {
        auth: {
          username: 'mock_client_id',
          password: 'mock_client_secret'
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
  })

  test('should include clientScope when provided', async () => {
    const oauth2 = new OAuth2();

    // Mock a successful token response
    const mockTokenResponse = {
      data: {
        access_token: 'mocked_access_token',
        token_type: 'Bearer',
        expires_in: 3600
      }
    };

    // Mock axios.post to resolve with the mock token response
    axios.post.mockResolvedValueOnce(mockTokenResponse);

    // Call the getToken method with a clientScope
    const tokenData = await oauth2.getToken(
      'https://idc-xxxxxxxxx.identity.oraclecloud.com',
      'mock_client_id',
      'mock_client_secret',
      'mock_scope'  // clientScope provided here
    );

    // Expect the clientScope to be included in the request
    expect(axios.post).toHaveBeenCalledWith(
      'https://idc-xxxxxxxxx.identity.oraclecloud.com' + Config.identityApi.tokenEndpoint,
      'grant_type=client_credentials&scope=mock_scope',
      {
        auth: {
          username: 'mock_client_id',
          password: 'mock_client_secret'
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    // Ensure token data is returned correctly
    expect(tokenData).toHaveProperty('access_token', 'mocked_access_token');
  });

  test('should not include clientScope when not provided', async () => {
    const oauth2 = new OAuth2();

    // Mock a successful token response
    const mockTokenResponse = {
      data: {
        access_token: 'mocked_access_token',
        token_type: 'Bearer',
        expires_in: 3600
      }
    };

    // Mock axios.post to resolve with the mock token response
    axios.post.mockResolvedValueOnce(mockTokenResponse);

    // Call the getToken method without a clientScope
    const tokenData = await oauth2.getToken(
      'https://idc-xxxxxxxxx.identity.oraclecloud.com',
      'mock_client_id',
      'mock_client_secret'  // No clientScope provided
    );

    // Expect the request body to not contain scope
    expect(axios.post).toHaveBeenLastCalledWith(
      'https://idc-xxxxxxxxx.identity.oraclecloud.com' + Config.identityApi.tokenEndpoint,
      'grant_type=client_credentials',  // No scope in the request body
      {
        auth: {
          username: 'mock_client_id',
          password: 'mock_client_secret'
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    // Ensure token data is returned correctly
    expect(tokenData).toHaveProperty('access_token', 'mocked_access_token');
  });


  test('should handle errors during token retrieval', async () => {
    const oauth2 = new OAuth2();

    const mockErrorResponse = {
      response: {
        data: {
          error: 'invalid_client',
          error_description: 'The client credentials are invalid.'
        }
      }
    };

    axios.post.mockRejectedValueOnce(mockErrorResponse);

    try {
      await oauth2.getToken(
        'https://idc-xxxxxxxxx.identity.oraclecloud.com',
        'invalid_client_id',
        'invalid_client_secret',
        'mock_client_scope'
      );
    } catch (error) {
      expect(error.response.data).toHaveProperty('error', 'invalid_client');
      expect(error.response.data).toHaveProperty('error_description', 'The client credentials are invalid.');
    }

    expect(axios.post).toHaveBeenCalledWith(
      'https://idc-xxxxxxxxx.identity.oraclecloud.com' + Config.identityApi.tokenEndpoint,
      'grant_type=client_credentials&scope=mock_client_scope',
      {
        auth: {
          username: 'invalid_client_id',
          password: 'invalid_client_secret'
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
  });

  test('should handle unexpected token response data', async () => {
    const oauth2 = new OAuth2(testenv);

    const mockInvalidTokenResponse = {
      data: {
        access_token: null, // Invalid token format
        token_type: 'Bearer',
        expires_in: null
      }
    };

    axios.post.mockResolvedValueOnce(mockInvalidTokenResponse);

    const tokenData = await oauth2.getToken();

    // Expect some handling of invalid token
    expect(tokenData.access_token).toBeNull();
    expect(tokenData.expires_in).toBeNull();
  });

  test('should use provided identityUrl if it is valid', async () => {
    const oauth2 = new OAuth2();

    const mockTokenResponse = {
      data: {
        access_token: 'mocked_access_token',
        token_type: 'Bearer',
        expires_in: 3600
      }
    };

    // Mock axios.post to resolve with the mock token response
    axios.post.mockResolvedValueOnce(mockTokenResponse);

    const tokenData = await oauth2.getToken(
      'https://identity.oraclecloud.com',  // Valid URL
      'mock_client_id',
      'mock_client_secret',
      'mock_client_scope'
    );

    // Ensure axios.post was called with the correct URL
    expect(axios.post).toHaveBeenCalledWith(
      'https://identity.oraclecloud.com' + Config.identityApi.tokenEndpoint,
      'grant_type=client_credentials&scope=mock_client_scope',
      {
        auth: {
          username: 'mock_client_id',
          password: 'mock_client_secret'
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    // Ensure the token data is returned correctly
    expect(tokenData).toHaveProperty('access_token', 'mocked_access_token');
  });

  test('should throw error if identityUrl is invalid', async () => {
    const oauth2 = new OAuth2();

    try {
        await oauth2.getToken(
          'invalid_url',  // Invalid URL
          'mock_client_id',
          'mock_client_secret',
          'mock_client_scope'
        );
    } catch (error) {
        // Expect the error message for an invalid URL
        expect(error.message).toBe('Invalid Identity URL.');
    }
  });

  test('should throw error if clientSecret is missing', async () => {
    const oauth2 = new OAuth2();
    try {
      await oauth2.getToken('https://idc-xxxxxxxxx.identity.oraclecloud.com', 'mock_client_id', null, 'mock_client_scope');
    } catch (error) {
      expect(error.message).toBe('Client ID or Client Secret is missing.');
    }
  });

  test('should throw error if clientId is missing', async () => {
    const oauth2 = new OAuth2();

    try {
      await oauth2.getToken('https://idc-xxxxxxxxx.identity.oraclecloud.com', null, 'mock_client_secret', 'mock_client_scope');
    } catch (error) {
      expect(error.message).toBe('Client ID or Client Secret is missing.');
    }
  });

  test('should throw error if response is undefined', async () => {
    const oauth2 = new OAuth2(testenv);

    // Mock an axios response with undefined response
    axios.post.mockResolvedValueOnce(undefined);

    try {
      await oauth2.getToken();
    } catch (error) {
      expect(error.message).toBe('Invalid token response structure.');
    }

    expect(axios.post).toHaveBeenCalled();
  });

  test('should throw error if response data is undefined', async () => {
    const oauth2 = new OAuth2(testenv);

    // Mock an axios response without data (undefined)
    axios.post.mockResolvedValueOnce({ data: undefined });

    try {
      await oauth2.getToken();
    } catch (error) {
      expect(error.message).toBe('Invalid token response structure.');
    }

    expect(axios.post).toHaveBeenCalled();
  });

});
