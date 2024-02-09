import { IncomingMessage, ServerResponse } from 'http';
import { validate as uuidValidate } from 'uuid';
import { connectDB } from '../../db/connectDB';
import { UserWithoutId } from '../../types/types';
import { getDataFromRequest } from '../../utils/getDataFromRequest';
import {
  handleInternalError,
  handleInvalidRequest,
  handleInvalidUserDataRequest,
  handleInvalidUserRequest,
  handleInvalidUUIDRequest,
  handleSuccessfulUserUpdateRequest,
} from './responseHandlers';

const isUserDataValid = (
  userData: unknown,
): userData is Partial<UserWithoutId> => {
  return !(
    !userData ||
    typeof userData !== 'object' ||
    ((!('username' in userData) || typeof userData.username !== 'string') &&
      (!('age' in userData) || typeof userData.age !== 'number') &&
      (!('hobbies' in userData) ||
        !Array.isArray(userData.hobbies) ||
        userData.hobbies.some((hobby) => typeof hobby !== 'string')))
  );
};

export const handlePutRequest = async (
  req: IncomingMessage,
  res: ServerResponse,
) => {
  const db = connectDB();
  const userPattern = /^\/api\/users\/([a-fA-F0-9-]+)\/?$/;
  const match = req.url?.match(userPattern);

  // Check url matches pattern '/api/users/<id>'
  if (!match) {
    await handleInvalidRequest(res);

    return;
  }

  const userId = match[1];

  if (!uuidValidate(userId)) {
    await handleInvalidUUIDRequest(res);

    return;
  }

  try {
    const data = await getDataFromRequest(req);
    let updateUserFields: Partial<UserWithoutId>;

    try {
      updateUserFields = JSON.parse(data);
    } catch (e) {
      await handleInvalidUserDataRequest(res);

      return;
    }

    if (!isUserDataValid(updateUserFields)) {
      await handleInvalidUserDataRequest(res);

      return;
    }

    const updatedUser = await db.updateUser(userId, updateUserFields);

    if (!updatedUser) {
      await handleInvalidUserRequest(res);

      return;
    }

    await handleSuccessfulUserUpdateRequest(res, updatedUser);
  } catch (error) {
    await handleInternalError(res);
  }
};
