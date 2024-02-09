import { connectDB } from '../../db/connectDB';
import { IncomingMessage, ServerResponse } from 'http';
import { User, UserWithoutId } from '../../types/types';
import {
  handleInternalError,
  handleInvalidRequest,
  handleInvalidUserDataRequest,
  handleSuccessfulUserCreationRequest,
} from './responseHandlers';

const isUserDataValid = (user: unknown): user is UserWithoutId => {
  return !(
    !user ||
    typeof user !== 'object' ||
    !('username' in user) ||
    typeof user.username !== 'string' ||
    !('age' in user) ||
    typeof user.age !== 'number' ||
    !('hobbies' in user) ||
    !Array.isArray(user.hobbies) ||
    user.hobbies.some((hobby) => typeof hobby !== 'string')
  );
};

const getDataFromRequest = (req: IncomingMessage): Promise<string> =>
  new Promise((resolve, reject) => {
    let data = '';

    req.on('data', (chunk) => {
      data += chunk;
    });

    req.on('end', () => {
      resolve(data);
    });

    req.on('error', (error) => {
      reject(error);
    });
  });

export const handlePostRequest = async (
  req: IncomingMessage,
  res: ServerResponse,
) => {
  const db = connectDB();
  const userPattern = /^\/api\/users\/?$/;
  const match = req.url?.match(userPattern);

  // Check url matches pattern '/api/users'
  if (!match) {
    await handleInvalidRequest(res);

    return;
  }

  try {
    const data = await getDataFromRequest(req);
    let newUser: UserWithoutId;

    try {
      newUser = JSON.parse(data);
    } catch (e) {
      await handleInvalidUserDataRequest(res);

      return;
    }

    if (!isUserDataValid(newUser)) {
      await handleInvalidUserDataRequest(res);

      return;
    }

    const user = await db.createUser(newUser);

    await handleSuccessfulUserCreationRequest(res, user);
  } catch (error) {
    await handleInternalError(res);
  }
};
