import cluster, { Worker } from 'cluster';
import { Workers } from '../types/types';

export const createWorkers = async (
  cpusAmount: number,
  port: number,
): Promise<Workers> => {
  const workers: Workers = [];

  for (let i = 1; i < cpusAmount; i++) {
    const workerPort = port + i;
    const worker = cluster.fork({ PORT: workerPort });

    workers.push({
      worker,
      host: 'localhost',
      port: workerPort,
    });
  }

  try {
    await Promise.all(
      workers.map(
        ({ worker }) =>
          new Promise((resolve) => worker.once('online', resolve)),
      ),
    );
  } catch (e) {
    return createWorkers(cpusAmount, port);
  }

  return workers;
};
