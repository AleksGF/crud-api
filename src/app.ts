import { env } from 'process';
import { startServer } from './server/startServer';

export const app = () => {
  const port = Number(env.PORT) || 4000;

  startServer(port);
};
