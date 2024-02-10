import http, { IncomingMessage, ServerResponse } from 'http';
import { handleInternalError } from '../requestHandlers/responseHandlers';
import { Workers } from '../types/types';

export const getBalancerRouter =
  (workers: Workers, currentWorker: { index: number }) =>
  async (req: IncomingMessage, res: ServerResponse) => {
    const worker = workers[currentWorker.index];

    currentWorker.index = (currentWorker.index + 1) % workers.length;

    const proxyRequest = http.request({
      host: worker.host,
      port: worker.port,
      method: req.method,
      path: req.url,
      headers: req.headers,
    });

    req.pipe(proxyRequest);

    proxyRequest.on('response', (workerResponse) => {
      workerResponse.pipe(res, { end: true });
    });

    proxyRequest.on('error', async () => {
      await handleInternalError(res);
    });
  };
