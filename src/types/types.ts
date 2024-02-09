export type User = {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
};

export type UserWithoutId = Omit<User, 'id'>;

export interface DBServices {
  getUsers(): Promise<User[]>;
  getUserById(id: string): Promise<User | undefined>;
  createUser(newUser: UserWithoutId): Promise<User>;
  updateUser(
    userId: string,
    userData: Partial<UserWithoutId>,
  ): Promise<User | undefined>;
}

export enum HttpMethods {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export enum HttpStatusCodes {
  OK_200 = 200,
  CREATED_201 = 201,
  NO_CONTENT_204 = 204,
  BAD_REQUEST_400 = 400,
  NOT_FOUND_404 = 404,
  METHOD_NOT_ALLOWED_405 = 405,
  INTERNAL_SERVER_ERROR_500 = 500,
}

export enum HttpStatusMessages {
  OK_200 = 'OK',
  CREATED_201 = 'Created',
  NO_CONTENT_204 = 'No Content',
  ID_NOT_VALID_400 = 'User ID is not a valid',
  USER_DATA_NOT_VALID_400 = 'User data is not valid',
  NOT_FOUND_404 = 'Not Found',
  NO_USER_FOUND_404 = 'No user found',
  METHOD_NOT_ALLOWED_405 = 'Method Not Allowed',
  INTERNAL_SERVER_ERROR_500 = 'Internal Server Error',
}

export const ContentTypeHeader = {
  TEXT: { 'Content-Type': 'text/plain' },
  JSON: { 'Content-Type': 'application/json' },
};
