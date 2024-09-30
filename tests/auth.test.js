// test/auth.test.js

const Auth = require('../src/api/oauth2'); // Update the import path
const identityConfig = require('../src/config/config'); // Update the import path


describe('Auth Module', () => {
    it('should obtain a token successfully', async () => {
        // Mock the axios post method
        jest.spyOn(require('axios'), 'post').mockImplementation(async () => {
            return {
                data: {
                    access_token: 'mock_access_token',
                    expires_in: 3600,
                    token_type: 'Bearer'
                }
            };
        });

        // Call the getToken method
        const tokenData = await Auth.getToken(identityConfig.clientId, identityConfig.clientSecret);

        // Validate the response
        expect(tokenData.access_token).toBe('mock_access_token');
        expect(tokenData.expires_in).toBe(3600);
        expect(tokenData.token_type).toBe('Bearer');

        // Restore the original implementation
        jest.restoreAllMocks();
    });

    it('should throw an error if token retrieval fails', async () => {
        // Mock the axios post method to simulate an error
        jest.spyOn(require('axios'), 'post').mockImplementation(async () => {
            throw new Error('Token retrieval failed');
        });

        // Expect the getToken method to throw an error
        await expect(Auth.getToken(identityConfig.clientId, identityConfig.clientSecret)).rejects.toThrow('Token retrieval failed');

        // Restore the original implementation
        jest.restoreAllMocks();
    });
});
