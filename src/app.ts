import os from 'os';
import http from 'http';
import cluster from 'cluster';
import { env } from 'process';
import { getBalancerRouter, workerRouter } from './router';
import { Workers } from './types/types';
import { createWorkers } from './workerServices';
import { getWorkerExitHandler } from './workerServices';
import { getWorkerMessageHandler } from './workerServices';

export const workerServer = http.createServer(workerRouter);

export const appSingleMode = (): void => {
  const port = Number(env.PORT) || 4000;

  workerServer.listen(port, () =>
    console.log(`Server listening on port ${port}`),
  );
};

export const appMultiMode = async (): Promise<void> => {
  const port = Number(env.PORT) || 4000;

  if (cluster.isPrimary) {
    const cpusAmount = os.cpus().length;

    if (cpusAmount < 2) {
      console.log('Need at least 2 CPUs to run in multi-process mode');
      process.exit(0);
    }

    const workers: Workers = await createWorkers(cpusAmount, port);

    cluster.on('exit', getWorkerExitHandler(workers));
    cluster.on('message', getWorkerMessageHandler());

    let currentWorker = { index: 0 };

    const loadBalancer = http.createServer(
      getBalancerRouter(workers, currentWorker),
    );

    loadBalancer.listen(port, () =>
      console.log(`Load balancer listening on port ${port}`),
    );
  } else {
    workerServer.listen(port, () =>
      console.log(`Worker ${process.pid} server listening on port ${port}`),
    );
  }
};
