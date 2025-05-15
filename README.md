# WEB BASE V3

## Web base v3 based on:

- React 17, umijs, antd v4
- TypeScript
- SSO with Keycloak
- Back-end: NestJS, PostgreSQL

This project is initialized with [Web Base](https://pro.ant.design). Follow is the quick guide for how to use.

## Environment Prepare

Install `node_modules`:

```bash
yarn
```

## Provided Scripts

RIPT S-Link provides some useful script to help you quick start and build with web project, code style check and test.

Scripts provided in `package.json`. It's safe to modify or add additional script:

### Start project

```bash
yarn start
```

### Build project

```bash
yarn build
```
user_id (INT, PK, AI - Primary Key, Auto Increment)
username (VARCHAR, UNIQUE, NOT NULL)
password_hash (VARCHAR, NOT NULL)
email (VARCHAR, UNIQUE, NOT NULL)
full_name (VARCHAR)
role (ENUM('student', 'admin'), NOT NULL)
created_at (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)
updated_at (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)
