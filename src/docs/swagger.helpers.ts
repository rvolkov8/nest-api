import { OpenAPIObject } from '@nestjs/swagger';

export function addSwaggerDocs(document: OpenAPIObject) {
  document.components = document.components || { schemas: {} };
  document.components.schemas = document.components.schemas || {};

  // === DTO Schemas ===

  document.components.schemas.SignInCredentialsDto = {
    type: 'object',
    properties: {
      username: { type: 'string', minLength: 4, maxLength: 10 },
      password: { type: 'string', minLength: 6, maxLength: 8 },
    },
    required: ['username', 'password'],
  };

  document.components.schemas.UserInfoDto = {
    type: 'object',
    properties: {
      username: { type: 'string', minLength: 4, maxLength: 10 },
      email: { type: 'string', format: 'email' },
      password: { type: 'string', minLength: 6, maxLength: 8 },
      age: { type: 'integer', minimum: 14, maximum: 120 },
      description: { type: 'string', maxLength: 1000 },
    },
    required: ['username', 'email', 'password', 'age', 'description'],
  };

  document.components.schemas.PaginationQueryDto = {
    type: 'object',
    properties: {
      page: { type: 'integer', minimum: 1 },
      limit: { type: 'integer', minimum: 1 },
    },
    required: ['page', 'limit'],
  };

  document.components.schemas.UserUpdateDto = {
    type: 'object',
    properties: {
      email: { type: 'string', format: 'email' },
      password: { type: 'string', minLength: 6, maxLength: 8 },
      age: { type: 'integer', minimum: 14, maximum: 120 },
      description: { type: 'string', maxLength: 1000 },
    },
    required: [],
  };

  document.components.schemas.BalanceTransferDto = {
    type: 'object',
    properties: {
      receiverUsername: { type: 'string', minLength: 4, maxLength: 10 },
      amount: { type: 'number', minimum: 0.01, multipleOf: 0.01 },
    },
    required: ['receiverUsername', 'amount'],
  };

  // === Endpoint Metadata ===
  const paths = document.paths;

  // --- AuthController ---
  if (paths['/auth/signup']?.post) {
    paths['/auth/signup'].post.summary = 'Used to create a new user';
    paths['/auth/signup'].post.requestBody = {
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/UserInfoDto' },
        },
      },
    };
    paths['/auth/signup'].post.responses = {
      201: { description: 'User successfully created' },
      400: { description: 'Bad request' },
      409: { description: 'Conflict – user already exists' },
    };
  }

  if (paths['/auth/signin']?.post) {
    paths['/auth/signin'].post.summary = 'Used to sign in a user';
    paths['/auth/signin'].post.requestBody = {
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/SignInCredentialsDto' },
        },
      },
    };
    paths['/auth/signin'].post.responses = {
      200: { description: 'User successfully signed in' },
      401: { description: 'Unauthorized – invalid credentials' },
    };
  }

  // --- UserController ---
  if (paths['/user/me']?.get) {
    paths['/user/me'].get.summary = 'Used to get the current user information';
    paths['/user/me'].get.responses = {
      200: { description: 'Current user information returned' },
      400: { description: 'Bad request' },
      401: { description: 'Unauthorized – invalid token' },
    };
  }

  if (paths['/user']?.get) {
    paths['/user'].get.summary = 'Used to get information of all users';
    paths['/user'].get.responses = {
      200: { description: 'List of users returned' },
      400: { description: 'Bad request' },
      401: { description: 'Unauthorized – invalid token' },
    };
  }

  if (paths['/user']?.patch) {
    paths['/user'].patch.summary =
      'Used to update the current user information';
    paths['/user'].patch.requestBody = {
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/UserUpdateDto' },
        },
      },
    };
    paths['/user'].patch.responses = {
      200: { description: 'User successfully updated' },
      400: { description: 'Bad request' },
      401: { description: 'Unauthorized – invalid token' },
    };
  }

  if (paths['/user']?.delete) {
    paths['/user'].delete.summary = 'Used to delete the current user';
    paths['/user'].delete.responses = {
      204: { description: 'User successfully deleted' },
      401: { description: 'Unauthorized – invalid token' },
      404: { description: 'User not found' },
    };
  }

  if (paths['/user/transfer']?.patch) {
    paths['/user/transfer'].patch.summary =
      'Used to transfer balance to another user by username';
    paths['/user/transfer'].patch.requestBody = {
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/BalanceTransferDto' },
        },
      },
    };
    paths['/user/transfer'].patch.responses = {
      204: { description: 'Balance successfully transferred' },
      400: {
        description: 'Bad request (e.g. same user or insufficient funds)',
      },
      401: { description: 'Unauthorized – invalid token' },
      404: { description: 'Sender or receiver not found' },
    };
  }
}
