1. Let's say we have the structure (database table):  

user
- id
- name
- city_id

role
- id
- name

user_role (n:m)
- user_id
- role_id

city (n:1)
- id
- name

2. We want to build rest API server with OData support.

3. /user?$select=id,name&$filter=name eq 'joe'&$expand=role,city

