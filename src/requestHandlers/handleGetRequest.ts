import { validate as uuidValidate } from 'uuid';
import { IncomingMessage, ServerResponse } from 'http';
import { connectDB } from '../dbServices';
import {
  handleInvalidRequest,
  handleInvalidUUIDRequest,
  handleInvalidUserRequest,
  handleSuccessfulUsersRequest,
  handleSuccessfulUserRequest,
} from './responseHandlers';

export const handleGetRequest = async (
  req: IncomingMessage,
  res: ServerResponse,
) => {
  const db = connectDB();
  const userPattern = /^\/api\/users\/?(([a-fA-F0-9-]+)\/?)?$/;
  const match = req.url?.match(userPattern);

  // Check url matches pattern '/api/users' or '/api/users/<id>'
  if (!match) {
    await handleInvalidRequest(res);

    return;
  }

  // Get UserId from RegExpMatchArray or null
  const userId = match[2] ? match[2] : null;

  // Handle '/api/users' endpoint
  if (!userId) {
    const users = await db.getUsers();
    await handleSuccessfulUsersRequest(res, users);

    return;
  }

  // Handle '/api/users/<id>' endpoint
  if (!uuidValidate(userId)) {
    await handleInvalidUUIDRequest(res);

    return;
  }

  const user = await db.getUserById(userId);

  if (!user) {
    await handleInvalidUserRequest(res);

    return;
  }

  await handleSuccessfulUserRequest(res, user);
};
