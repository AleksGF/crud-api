import { IncomingMessage, ServerResponse } from 'http';
import { validate as uuidValidate } from 'uuid';
import { connectDB } from '../../db/connectDB';
import { UserWithoutId } from '../../types/types';
import { getDataFromRequest } from '../../utils/getDataFromRequest';
import { isPartialUserDataValid } from '../../utils/validators';
import {
  handleInternalError,
  handleInvalidRequest,
  handleInvalidUserDataRequest,
  handleInvalidUserRequest,
  handleInvalidUUIDRequest,
  handleSuccessfulUserUpdateRequest,
} from './responseHandlers';

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
    let updateUserFields: Partial<UserWithoutId> = JSON.parse(data);

    if (!isPartialUserDataValid(updateUserFields)) {
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
    if (error instanceof SyntaxError) {
      await handleInvalidUserDataRequest(res);
    } else {
      await handleInternalError(res);
    }
  }
};
