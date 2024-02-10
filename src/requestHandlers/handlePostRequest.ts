import { connectDB } from '../dbServices';
import { IncomingMessage, ServerResponse } from 'http';
import { User, UserWithoutId } from '../types/types';
import { getDataFromRequest } from '../utils/getDataFromRequest';
import { isUserDataValid } from '../utils/validators';
import {
  handleInternalError,
  handleInvalidRequest,
  handleInvalidUserDataRequest,
  handleSuccessfulUserCreationRequest,
} from './responseHandlers';

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
    const newUser: UserWithoutId = JSON.parse(data);

    if (!isUserDataValid(newUser)) {
      await handleInvalidUserDataRequest(res);

      return;
    }

    const user = await db.createUser(newUser);

    await handleSuccessfulUserCreationRequest(res, user);
  } catch (error) {
    if (error instanceof SyntaxError) {
      await handleInvalidUserDataRequest(res);
    } else {
      await handleInternalError(res);
    }
  }
};
