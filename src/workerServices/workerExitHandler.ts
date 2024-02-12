import cluster, { Worker } from 'cluster';
import { Workers } from '../types/types';

export const getWorkerExitHandler =
  (workers: Workers) => (worker: Worker, code: number) => {
    if (code !== 0) {
      console.log(`Worker ${worker.process.pid} died`);
      const workerIndex = workers.findIndex(
        (workerItem) => workerItem.worker.process.pid === worker.process.pid,
      );

      if (workerIndex !== -1) {
        workers[workerIndex].worker = cluster.fork({
          PORT: workers[workerIndex].port,
        });
      }
    }
  };
