const path = require('path');
const dotenv = require('dotenv');
const Config = require('../../src/config/config'); // Adjust the path if necessary


describe('Config Class', () => {
  const testenv = './tests/test.env';

  // After each test, reset environment variables to avoid leakage between tests
  afterEach(() => {
    jest.resetModules(); // Reset module cache
    delete process.env.OCI_IDENTITY_URL;
    delete process.env.OCI_OAUTH_CLIENT;
    delete process.env.OCI_OAUTH_SECRET;
    delete process.env.OCI_OAUTH_SCOPE;
  });

  test('should load environment variables from env file', () => {
    const config = new Config(testenv);
    const oauthConfig = config.getIdentityOAuthConfig();

    // Validate the loaded environment variables
    expect(oauthConfig.apiBaseUrl).toBe('https://idc-xxxxxxxxx.identity.oraclecloud.com');
    expect(oauthConfig.clientId).toBe('mock_client_id');
    expect(oauthConfig.clientSecret).toBe('mock_client_secret');
    expect(oauthConfig.clientScope).toBe('mock_client_scope');
  });

  test('should throw error for invalid env file path', () => {
    expect(() => {
      const config = new Config('./nonexistent.env');
    }).toThrow();
  });

  test('should throw error for malformed env file', () => {
    // Mock dotenv to simulate a malformed .env file
    const dotenvMock = jest.spyOn(dotenv, 'config').mockReturnValueOnce({ error: new Error('Malformed .env file') });
  
    expect(() => {
      const config = new Config('./malformed.env');
    }).toThrow('Error loading environment variables from file:');

    // Restore the original implementation of dotenv.config after the test
    dotenvMock.mockRestore();
  });
  

});