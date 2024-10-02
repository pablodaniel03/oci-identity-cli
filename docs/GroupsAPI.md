# Groups API Documentation

The **Groups API** provides functionality for managing groups in Oracle Identity Cloud. This release includes the ability to search, create, update, and delete groups, as well as manage group members.

## Features:

- **Search Groups**: Query groups using filters, pagination, and sorting.
- **Create Group**: Create a new group.
- **Update Group**: Modify an existing group, including updating its members.
- **Delete Group**: Remove a group by its ID.
- **Manage Group Members**: Add or remove members from a group.
- **Retrieve Group Members**: Get the list of members associated with a specific group.

---

## Methods:

### 1. **Search Groups**

Search for groups using various criteria like filters, pagination, and sorting.

#### Method:

```javascript
async search(queryParams = {})
```

#### Parameters:

- **`filter`** (optional): SCIM filter to filter groups based on specific attributes.
- **`attributes`** (optional): A comma-separated string specifying the attributes to be returned.
- **`count`** (optional): Maximum number of results per page (default 100, maximum 1000).
- **`sortBy`** (optional): Attribute to sort the results by.
- **`sortOrder`** (optional): Order of sorting (`ascending` or `descending`).
- **`startIndex`** (optional): Index of the first result (used for pagination).

#### Example Usage:

```javascript
const queryParams = {
  filter: "displayName eq 'Developers'",
  attributes: "id,displayName",
  count: 100,
  sortBy: "displayName",
  sortOrder: "ascending"
};
const groups = await groupsApi.search(queryParams);
```

---

### 2. **Create Group**

Create a new group in Oracle Identity Cloud.

#### Method:

```javascript
async createGroup(groupData)
```

#### Parameters:

- **`groupData`**: An object containing the group details. The `displayName` is required.

#### Example Usage:

```javascript
const groupData = {
  schemas: ["urn:ietf:params:scim:schemas:core:2.0:Group"],
  displayName: "New Group",
  members: [
    { value: "userId1", type: "User" }
  ]
};
const newGroup = await groupsApi.createGroup(groupData);
```

---

### 3. **Update Group**

Update an existing group. Supports adding or removing members, or modifying group details.

#### Method:

```javascript
async patchGroup(groupId, payload)
```

#### Parameters:

- **`groupId`**: The ID of the group to update.
- **`payload`**: The SCIM payload for patch operations.

#### Example Usage:

```javascript
const payload = {
  schemas: ["urn:ietf:params:scim:api:messages:2.0:PatchOp"],
  Operations: [
    {
      op: "replace",
      path: "displayName",
      value: "Updated Group Name"
    }
  ]
};
await groupsApi.patchGroup("groupId123", payload);
```

---

### 4. **Delete Group**

Delete a group by its ID.

#### Method:

```javascript
async deleteGroup(groupId)
```

#### Parameters:

- **`groupId`**: The ID of the group to delete.

#### Example Usage:

```javascript
await groupsApi.deleteGroup("groupId123");
```

---

### 5. **Add Group Members**

Add members to a group.

#### Method:

```javascript
async patchGroup(groupId, payload)
```

#### Parameters:

- **`groupId`**: The ID of the group to update.
- **`payload`**: The SCIM payload to add members.

#### Example Usage:

```javascript
const payload = {
  schemas: ["urn:ietf:params:scim:api:messages:2.0:PatchOp"],
  Operations: [
    {
      op: "add",
      path: "members",
      value: [
        { value: "userId1", type: "User" },
        { value: "userId2", type: "User" }
      ]
    }
  ]
};
await groupsApi.patchGroup("groupId123", payload);
```

---

### 6. **Remove Group Members**

Remove members from a group.

#### Method:

```javascript
async patchGroup(groupId, payload)
```

#### Parameters:

- **`groupId`**: The ID of the group to update.
- **`payload`**: The SCIM payload to remove members.

#### Example Usage:

```javascript
const payload = {
  schemas: ["urn:ietf:params:scim:api:messages:2.0:PatchOp"],
  Operations: [
    {
      op: "remove",
      path: "members[value eq 'userId1']"
    }
  ]
};
await groupsApi.patchGroup("groupId123", payload);
```

---

### 7. **Get Group Members**

Retrieve members of a specific group.

#### Method:

```javascript
async getGroupById(groupId, queryParams)
```

#### Parameters:

- **`groupId`**: The ID of the group.
- **`queryParams`** (optional): An object specifying which attributes to retrieve (e.g., `"attributes=members,displayName"`).

#### Example Usage:

```javascript
const group = await groupsApi.getGroupById("groupId123", { attributes: "members,displayName" });
console.log(group.members);
```

---

### SCIM Filter Examples:

Here are some example filters that can be used with the **`search`** method:

- **`displayName eq 'Developers'`**: Search for groups with a specific displayName.
- **`displayName co 'Admin'`**: Search for groups whose displayName contains the word "Admin".
- **`id eq '0123456789'`**: Search for a group by its ID.

> See [*SCIM Specification*](./SCIM.md) for more details.

---

## Release Notes:

This release brings full support for managing groups and group members, including search functionality with flexible filtering, sorting, and pagination options.

### New Features:

- **Group Search**: Search for groups with advanced filtering, pagination, and sorting options.
- **Group Management**: Create, update, and delete groups.
- **Group Membership Management**: Add or remove members from a group.
- **Query Optimization**: Limit the attributes returned by using the `attributes` query parameter.

### Example Use Cases:

- **Create a new group** and add members.
- **Search for groups** using SCIM filters with pagination.
- **Update group details** or **modify group members** using the PATCH operation.
- **Delete groups** no longer in use.

---

This documentation can be used as the **description** for your **GitHub release**, and it provides a solid foundation for users to understand the new features and functionality available in the **Groups API**.
