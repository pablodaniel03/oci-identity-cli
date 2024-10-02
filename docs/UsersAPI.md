# Users API Documentation

The **Users API** in Oracle Identity Cloud provides functionality for managing users. This API includes capabilities to search, create, update, and delete users, along with retrieving user details by ID.

## Features:

- **Search Users**: Query users with filters, pagination, and sorting.
- **Create User**: Add a new user to the system.
- **Retrieve User by ID**: Fetch a user's details using their unique identifier.
- **Delete User**: Remove a user from the system.

---

## Methods:

### 1. **Search Users**

Search for users using various query options such as filters, pagination, and sorting.

#### Method:

```javascript
async search(queryParams = {})
```

#### Parameters:

- **`filter`** (optional): SCIM filter to filter users based on specific attributes.
- **`attributes`** (optional): A comma-separated string specifying the attributes to return in the response.
- **`count`** (optional): Maximum number of results per page (default 100, maximum 1000).
- **`sortBy`** (optional): Attribute to sort the results by.
- **`sortOrder`** (optional): Order of sorting (`ascending` or `descending`).
- **`startIndex`** (optional): Index of the first result for pagination.

#### Example Usage:

```javascript
const queryParams = {
  filter: "displayName eq 'John'",
  attributes: "id,displayName",
  count: 100,
  sortBy: "displayName",
  sortOrder: "ascending"
};
const users = await usersApi.search(queryParams);
```

---

### 2. **Get User by ID**

Retrieve a user's details by their unique identifier.

#### Method:

```javascript
async getUserById(userId)
```

#### Parameters:

- **`userId`**: The unique identifier of the user.

#### Example Usage:

```javascript
const user = await usersApi.getUserById("userId123");
console.log(user);
```

---

### 3. **Create User**

Create a new user in the Oracle Identity Cloud.

#### Method:

```javascript
async createUser(data)
```

#### Parameters:

- **`data`**: An object containing the user details. The `userName` and `emails` attributes are required.

#### Example Usage:

```javascript
const userData = {
  schemas: ["urn:ietf:params:scim:schemas:core:2.0:User"],
  userName: "johndoe",
  name: {
    givenName: "John",
    familyName: "Doe"
  },
  emails: [
    {
      value: "johndoe@example.com",
      type: "work",
      primary: true
    }
  ],
  active: true
};
const newUser = await usersApi.createUser(userData);
console.log(newUser);
```

---

### 4. **Delete User**

Delete a user by their unique identifier.

#### Method:

```javascript
async deleteUser(userId)
```

#### Parameters:

- **`userId`**: The unique identifier of the user.

#### Example Usage:

```javascript
await usersApi.deleteUser("userId123");
console.log("User deleted successfully");
```

---

### SCIM Filter Examples:

Here are some example filters that can be used with the **`search`** method:

- **`displayName eq 'John'`**: Search for users with a display name of "John".
- **`userName co 'doe'`**: Search for users whose usernames contain "doe".
- **`emails.value eq 'johndoe@example.com'`**: Search for users with the specified email.
- **`meta.lastModified gt '2024-01-01T00:00:00Z'`**: Search for users whose details were modified after the specified date.

> See [*SCIM Specification*](./SCIM.md) for more details.

---

## Release Notes:

This release introduces comprehensive user management functionality in Oracle Identity Cloud, including the ability to search, create, retrieve, and delete users.

### New Features:

- **User Search**: Search users using advanced SCIM filtering, pagination, and sorting options.
- **User Creation**: Create new users with detailed attributes such as `userName`, `emails`, and more.
- **User Deletion**: Remove users by their unique identifier.
- **Query Optimization**: Use query parameters to limit the response size by selecting specific attributes.

### Example Use Cases:

- **Create a new user** with details like name, email, and status.
- **Search for users** using advanced SCIM filters and pagination.
- **Retrieve user details** by their ID.
- **Delete users** when they are no longer needed in the system.

---

This documentation provides a detailed overview of the **Users API** and can be used as part of the release notes or project documentation for the new GitHub release.
