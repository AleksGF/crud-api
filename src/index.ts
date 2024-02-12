import dotenv from 'dotenv';
import { appSingleMode, appMultiMode } from './app';

dotenv.config();

if (process.argv.includes('--multi')) {
  appMultiMode();
} else {
  appSingleMode();
}
