# OpenFeedback API

A modern, scalable REST API built with **Fastify**, **TypeScript**, **TypeBox**, and **Swagger** for the OpenFeedback platform.

## Features

-   🚀 **High Performance**: Built on Fastify for maximum speed and efficiency
-   📝 **Type Safety**: Full TypeScript support with TypeBox for runtime validation
-   📚 **Auto Documentation**: Swagger/OpenAPI 3.0 with automatic schema generation
-   🔒 **Security First**: JWT authentication, rate limiting, CORS, and security headers
-   🏗️ **Modular Architecture**: Clean, maintainable code structure
-   🔥 **Firebase Integration**: Seamless integration with Firebase Functions
-   🌐 **Future Proof**: Designed for easy migration and scaling

## Quick Start

### Development Server

```bash
# Install dependencies
cd functions
npm install

# Start development server
npm run dev:api

# Or with auto-reload
npm run dev:api:watch
```

The API will be available at:

-   **API**: http://localhost:3000
-   **Documentation**: http://localhost:3000/docs
-   **Health Check**: http://localhost:3000/health

### Firebase Functions

```bash
# Build and serve with Firebase emulator
npm run serve

# Deploy to Firebase
npm run deploy
```

## API Structure

### Authentication

The API supports multiple authentication methods:

-   **JWT Bearer Token**: For user authentication
-   **API Key**: For service-to-service communication
-   **Firebase ID Token**: For Firebase-authenticated users

#### Authentication Endpoints

-   `POST /api/v1/auth/login` - Email/password login
-   `POST /api/v1/auth/register` - User registration
-   `POST /api/v1/auth/refresh` - Refresh access token
-   `POST /api/v1/auth/firebase` - Firebase token authentication
-   `POST /api/v1/auth/logout` - Logout user
-   `GET /api/v1/auth/me` - Get current user profile

### Resources

#### Users

-   `GET /api/v1/users` - List users (admin only)
-   `GET /api/v1/users/:id` - Get user profile
-   `PUT /api/v1/users/:id` - Update user profile
-   `DELETE /api/v1/users/:id` - Delete user (admin only)

#### Organizations

-   `GET /api/v1/organizations` - List organizations
-   `POST /api/v1/organizations` - Create organization
-   `GET /api/v1/organizations/:id` - Get organization
-   `PUT /api/v1/organizations/:id` - Update organization
-   `DELETE /api/v1/organizations/:id` - Delete organization
-   `GET /api/v1/organizations/:id/members` - Get organization members

#### Projects

-   `GET /api/v1/projects` - List projects
-   `POST /api/v1/projects` - Create project
-   `GET /api/v1/projects/:id` - Get project
-   `PUT /api/v1/projects/:id` - Update project
-   `DELETE /api/v1/projects/:id` - Delete project

## Environment Variables

Create a `.env` file in the `functions` directory:

```bash
# Server Configuration
NODE_ENV=development
PORT=3000
HOST=0.0.0.0
LOG_LEVEL=debug
API_BASE_URL=http://localhost:3000

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=24h
API_KEY_SECRET=your-super-secret-api-key-change-in-production
REFRESH_TOKEN_EXPIRES_IN=7d
PASSWORD_SALT_ROUNDS=12

# Rate Limiting
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=1 minute

# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email

# Database (for future use)
DATABASE_URL=postgresql://user:pass@localhost:5432/openfeedback
```

## Architecture

### Project Structure

```
src/api/
├── config.ts              # Configuration management
├── server.ts              # Fastify server setup
├── api.ts                 # Main API export
├── standalone.ts          # Standalone server for development
├── plugins/               # Fastify plugins
│   ├── auth.ts           # Authentication middleware
│   └── error-handler.ts  # Global error handling
├── routes/               # API routes
│   ├── index.ts         # Route registration
│   ├── auth.ts          # Authentication routes
│   ├── users.ts         # User management
│   ├── organizations.ts # Organization management
│   └── projects.ts      # Project management
└── schemas/             # TypeBox schemas
    └── index.ts         # Shared schemas and types
```

### Key Design Principles

1. **Type Safety First**: Every request/response is validated with TypeBox schemas
2. **Modular Routes**: Each resource has its own route file with clear separation
3. **Consistent Error Handling**: Unified error responses across all endpoints
4. **Security by Default**: Rate limiting, CORS, and security headers enabled
5. **Comprehensive Logging**: Structured logging with request tracing
6. **Future-Proof**: Clean architecture that supports growth and changes

### TypeBox Schemas

All API contracts are defined using TypeBox schemas that provide:

-   **Runtime Validation**: Automatic request/response validation
-   **TypeScript Types**: Generated TypeScript types from schemas
-   **OpenAPI Documentation**: Automatic Swagger documentation generation
-   **IDE Support**: Full IntelliSense and type checking

Example schema:

```typescript
export const UserProfileSchema = Type.Object({
    id: IdSchema,
    email: Type.String({ format: 'email' }),
    firstName: Type.String(),
    lastName: Type.String(),
    role: Type.Union([
        Type.Literal('user'),
        Type.Literal('admin'),
        Type.Literal('super_admin'),
    ]),
    createdAt: TimestampSchema,
    updatedAt: TimestampSchema,
})

export type UserProfile = Static<typeof UserProfileSchema>
```

## Security Features

-   **JWT Authentication**: Secure token-based authentication
-   **Rate Limiting**: Configurable rate limits per endpoint
-   **CORS Protection**: Configurable CORS policies
-   **Security Headers**: Helmet.js for security headers
-   **Input Validation**: Comprehensive request validation
-   **Error Sanitization**: No sensitive information in error responses

## Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## Deployment

### Firebase Functions

The API is deployed as a Firebase HTTP function:

```bash
npm run deploy
```

Access the deployed API at:

```
https://us-central1-{your-project-id}.cloudfunctions.net/api
```

### Standalone Deployment

The API can also be deployed as a standalone Node.js application to any cloud provider:

```bash
# Build for production
npm run build

# Start production server
NODE_ENV=production node lib/api/standalone.js
```

## Migration Path

This API is designed to be future-proof and migration-friendly:

1. **Database Agnostic**: Easy to switch from Firestore to PostgreSQL/MySQL
2. **Authentication Flexible**: Supports multiple auth providers
3. **Deployment Options**: Firebase Functions or standalone deployment
4. **Version Support**: Built-in API versioning (v1, v2, etc.)

## Contributing

1. Follow TypeScript and ESLint best practices
2. All new endpoints must include TypeBox schemas
3. Add comprehensive error handling
4. Update documentation for new features
5. Write tests for new functionality

## License

MIT - See LICENSE.md for details
