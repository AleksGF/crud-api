import { v4 as uuidv4 } from 'uuid';
import {
  User,
  DBServices,
  UserWithoutId,
  WorkerDBAction,
  WorkerDBActionResponse,
} from '../types/types';

export class WorkerDBServices implements DBServices {
  private async sendActionMassage(
    message: WorkerDBAction,
  ): Promise<User[] | User | boolean | undefined> {
    return new Promise((resolve, reject) => {
      if (!process.send) {
        return reject('process.send is not defined');
      }

      const msgId = uuidv4();

      process.send({ msgId, ...message });

      process.on('message', (msg: WorkerDBActionResponse) => {
        if (msg.msgId === msgId && msg.error) {
          return reject(msg.error);
        }

        if (msg.msgId === msgId && msg.data) {
          return resolve(msg.data);
        }
      });
    });
  }

  public async getUsers() {
    return (await this.sendActionMassage({ type: 'getUsers' })) as User[];
  }

  public async getUserById(id: string) {
    return (await this.sendActionMassage({
      type: 'getUserById',
      payload: { userId: id },
    })) as User | undefined;
  }

  public async createUser(newUser: UserWithoutId) {
    return (await this.sendActionMassage({
      type: 'createUser',
      payload: { userData: newUser },
    })) as User;
  }

  public async updateUser(userId: string, userData: Partial<UserWithoutId>) {
    return (await this.sendActionMassage({
      type: 'updateUser',
      payload: { userId, userData },
    })) as User | undefined;
  }

  public async deleteUser(userId: string) {
    return (await this.sendActionMassage({
      type: 'deleteUser',
      payload: { userId },
    })) as boolean;
  }
}
