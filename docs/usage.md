# Usage of Cloud Identity CLI

## Users

- Get OAuth2 Bearer Token from IDCS/Identity Cloud.
  - Providing arguments

  ```shell
  #   * --url: "Your Identity Cloud URL".
  #   * --client-id: "OAuth User or Client Identifier".
  #   * --client-secret: "OAuth Password or Client's Secret".
  #   * --client-scope: "Optional: If your OAuth2 App requires a scope, declare this argument."
  oci-identity-cli get-token --url "https://idc-xxxxxxxxx.identity.oraclecloud.com" \
                             --client-id "0f00b0e0bf0ac0l00a000" \
                             --client-secret "01ac-300-4r00-94fe-c0000abc0"
  ```

  - Using Environment file

  ```shell
  #   * --env: "Create a ENV file with the required variables to call your Identity instance and get the Bearer token."
  oci-identity-cli get-token --env "./myenvironment.env"
  ```

## Environment File

This is an example of your Environment file.

```env
OCI_IDENTITY_URL=https://idc-xxxxxxxxx.identity.oraclecloud.com
OCI_OAUTH_CLIENT="0f00b0e0bf0ac0l00a000"
OCI_OAUTH_SECRET="01ac-300-4r00-94fe-c0000abc0"
OCI_OAUTH_SCOPE="urn:opc:idm:__myscopes__"
```
