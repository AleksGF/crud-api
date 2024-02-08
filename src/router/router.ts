import { IncomingMessage, ServerResponse } from 'http';
import {
  ContentTypeHeader,
  HttpMethods,
  HttpStatusCodes,
  HttpStatusMessages,
} from '../types/types';
import {
  handleDeleteRequest,
  handleGetRequest,
  handlePostRequest,
  handlePutRequest,
} from './handlers';

const defaultHeaders = [
  { name: 'Access-Control-Allow-Origin', value: '*' },
  {
    name: 'Access-Control-Allow-Methods',
    value: Object.values(HttpMethods).toString(),
  },
  { name: 'Access-Control-Allow-Headers', value: 'Content-Type' },
];

export const router = async (req: IncomingMessage, res: ServerResponse) => {
  try {
    defaultHeaders.forEach((header) => {
      res.setHeader(header.name, header.value);
    });

    switch (req.method) {
      case HttpMethods.GET:
        await handleGetRequest(req, res);
        break;
      case HttpMethods.POST:
        await handlePostRequest(req, res);
        break;
      case HttpMethods.PUT:
        await handlePutRequest(req, res);
        break;
      case HttpMethods.DELETE:
        await handleDeleteRequest(req, res);
        break;
      default:
        res.writeHead(
          HttpStatusCodes.METHOD_NOT_ALLOWED_405,
          ContentTypeHeader.TEXT,
        );
        res.end(HttpStatusMessages.METHOD_NOT_ALLOWED_405);
    }
  } catch (e) {
    // TODO Remove it
    console.log(e);

    res.writeHead(
      HttpStatusCodes.INTERNAL_SERVER_ERROR_500,
      ContentTypeHeader.TEXT,
    );
    res.end(HttpStatusMessages.INTERNAL_SERVER_ERROR_500);
  }
};
