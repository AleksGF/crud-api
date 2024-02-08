import { env } from 'process';
import { v4 as uuidv4 } from 'uuid';
import { connectDB } from './db/connectDB';
import { startServer } from './server/startServer';

export const app = () => {
  const port = Number(env.PORT) || 4000;

  //TODO: Remove it
  connectDB().then((db) => {
    for (let i = 0; i < 20; i++) {
      const id = uuidv4();

      db.users.push({
        id,
        username: `UserName${i}`,
        age: 20 + i,
        hobbies: [`test${i}`],
      });
    }
  });

  startServer(port);
};
