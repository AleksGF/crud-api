import { IncomingMessage, ServerResponse } from 'http';
import { validate as uuidValidate } from 'uuid';
import { connectDB } from '../../db/connectDB';
import {
  handleInvalidRequest,
  handleInvalidUUIDRequest,
  handleSuccessfulUserDeleteRequest,
} from './responseHandlers';

export const handleDeleteRequest = async (
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

  const result = await db.deleteUser(userId);

  if (!result) {
    await handleInvalidRequest(res);

    return;
  }

  await handleSuccessfulUserDeleteRequest(res);
};
