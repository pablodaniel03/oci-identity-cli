# SCIM Specification

The filter expressions used in your CLI examples follow the **SCIM (System for Cross-domain Identity Management)** specification. SCIM is a standard for automating the exchange of user identity information between identity domains or IT systems. The SCIM protocol defines query parameters for filtering resources (like users) based on attributes, and the **filter** expression is part of the SCIM specification.

### SCIM Filter Syntax Overview:

SCIM supports filtering using attributes, operators, and values to refine searches. The basic syntax follows this pattern:

```
attribute operator value
```

### Common SCIM Operators

- **eq**: Equals
- **co**: Contains (substring match)
- **sw**: Starts with
- **pr**: Present (attribute is defined)
- **gt**: Greater than
- **lt**: Less than
- **ge**: Greater than or equal to
- **le**: Less than or equal to
- **ne**: Not equal to

### Example Filter Expressions

1. **Exact Match (`eq`)**:
   - `"userName eq 'johndoe'"` will return users whose `userName` exactly matches `johndoe`.

2. **Contains (`co`)**:
   - `"displayName co 'Pablo'"` will return users whose `displayName` contains the substring `"Pablo"`.

3. **Starts With (`sw`)**:
   - `"email sw 'pablo'"` will return users whose `email` starts with `"pablo"`.

4. **Attribute is Present (`pr`)**:
   - `"emails pr"` will return users who have an email attribute defined.

5. **Greater Than (`gt`)**:
   - `"meta.lastModified gt '2024-01-01T00:00:00Z'"` will return users whose last modification date is after January 1, 2024.

6. **Less Than (`lt`)**:
   - `"meta.created lt '2023-01-01T00:00:00Z'"` will return users created before January 1, 2023.

7. **Not Equal (`ne`)**:
   - `"active ne true"` will return users who are not active.

### Combining Filters

SCIM allows you to combine multiple filter expressions using logical operators:

- **AND**: `and`
- **OR**: `or`

#### Example:

```bash
"userName eq 'johndoe' and active eq true"
```

This filter retrieves users whose `userName` is `"johndoe"` and who are also active.

### Example SCIM Specification Query with Multiple Conditions:

```bash
node index.js user-list --filter "userName eq 'johndoe' and emails.value eq 'johndoe@example.com'" --envfile ./development.env
```

### SCIM Resources:

If you're looking to dig deeper into the SCIM specification, you can refer to the official documentation:

- **SCIM 2.0 Specification**: [https://tools.ietf.org/html/rfc7644](https://tools.ietf.org/html/rfc7644)
- **SCIM Filtering (Section 3.4.2)**: [https://tools.ietf.org/html/rfc7644#section-3.4.2](https://tools.ietf.org/html/rfc7644#section-3.4.2)
