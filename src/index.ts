import dotenv from 'dotenv';
import { appSingleMode, appMultiMode } from './app';

export const startApp = () => {
  dotenv.config();

  if (process.argv.includes('--multi')) {
    appMultiMode();
  } else {
    appSingleMode();
  }
};

startApp();
