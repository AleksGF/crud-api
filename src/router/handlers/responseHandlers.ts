import { ServerResponse } from 'http';
import {
  ContentTypeHeader,
  HttpStatusCodes,
  HttpStatusMessages,
  User,
} from '../../types/types';

export const handleInvalidRequest = async (res: ServerResponse) => {
  res.writeHead(HttpStatusCodes.NOT_FOUND_404, ContentTypeHeader.TEXT);
  res.end(HttpStatusMessages.NOT_FOUND_404);
};

export const handleInvalidUUIDRequest = async (res: ServerResponse) => {
  res.writeHead(HttpStatusCodes.BAD_REQUEST_400, ContentTypeHeader.TEXT);
  res.end(HttpStatusMessages.ID_NOT_VALID_400);
};

export const handleInvalidUserRequest = async (res: ServerResponse) => {
  res.writeHead(HttpStatusCodes.NOT_FOUND_404, ContentTypeHeader.TEXT);
  res.end(HttpStatusMessages.NO_USER_FOUND_404);
};

export const handleInvalidUserDataRequest = async (res: ServerResponse) => {
  res.writeHead(HttpStatusCodes.BAD_REQUEST_400, ContentTypeHeader.TEXT);
  res.end(HttpStatusMessages.USER_DATA_NOT_VALID_400);
};

export const handleInternalError = async (res: ServerResponse) => {
  res.writeHead(
    HttpStatusCodes.INTERNAL_SERVER_ERROR_500,
    ContentTypeHeader.TEXT,
  );
  res.end(HttpStatusMessages.INTERNAL_SERVER_ERROR_500);
};

export const handleSuccessfulUsersRequest = async (
  res: ServerResponse,
  users: User[],
) => {
  res.writeHead(HttpStatusCodes.OK_200, ContentTypeHeader.JSON);
  res.end(JSON.stringify(users));
};

export const handleSuccessfulUserRequest = async (
  res: ServerResponse,
  user: User,
) => {
  res.writeHead(HttpStatusCodes.OK_200, ContentTypeHeader.JSON);
  res.end(JSON.stringify(user));
};

export const handleSuccessfulUserCreationRequest = async (
  res: ServerResponse,
  user: User,
) => {
  res.writeHead(HttpStatusCodes.CREATED_201, ContentTypeHeader.JSON);
  res.end(JSON.stringify(user));
};
