import { Worker } from 'cluster';
import { connectDB } from '../dbServices';
import { WorkerDBActionRequest } from '../types/types';

export const getWorkerMessageHandler =
  () => async (worker: Worker, message: WorkerDBActionRequest) => {
    const { msgId, type } = message;
    const db = connectDB();

    switch (type) {
      case 'getUsers':
        worker.send({ msgId, data: await db.getUsers() });
        break;

      case 'getUserById':
        worker.send({
          msgId,
          data: await db.getUserById(message.payload.userId),
        });
        break;

      case 'createUser':
        worker.send({
          msgId,
          data: await db.createUser(message.payload.userData),
        });
        break;

      case 'updateUser':
        worker.send({
          msgId,
          data: await db.updateUser(
            message.payload.userId,
            message.payload.userData,
          ),
        });
        break;

      case 'deleteUser':
        worker.send({
          msgId,
          data: await db.deleteUser(message.payload.userId),
        });
        break;

      default:
        worker.send({ msgId, error: 'Unknown action type' });
    }
  };
