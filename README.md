# My Node.js App

This project is a Node.js application built with Express, TypeScript, TypeORM, and MySQL. It serves as a basic template for creating RESTful APIs.

## Features

- Express framework for building web applications
- TypeScript for type safety
- TypeORM for database interaction
- MySQL as the database

## Prerequisites

- Node.js (version 14 or higher)
- MySQL (version 5.7 or higher)

## Installation

1. Clone the repository:

   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:

   ```
   cd my-nodejs-app
   ```

3. Install the dependencies:

   ```
   npm install
   ```

## Configuration

Before running the application, configure your database connection in `src/data-source.ts`:

```typescript
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'your-username',
    password: 'your-password',
    database: 'your-database',
    entities: [__dirname + '/entities/*.ts'],
    migrations: [__dirname + '/migrations/*.ts'],
});
```

## Running the Application

To start the application, run:

```
npm run start
```

The server will be running on `http://localhost:3000`.

## API Endpoints

- `GET /users`: Retrieve all users
- `POST /users`: Create a new user

## License

This project is licensed under the MIT License.