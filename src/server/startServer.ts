import http from 'http';
import { router } from '../router/router';

export const startServer = (port: number, workerIndex?: number) => {
  http
    .createServer(router)
    .listen(port, () =>
      console.log(`Server ${workerIndex ?? 'main'} listening on port ${port}`),
    );
};
