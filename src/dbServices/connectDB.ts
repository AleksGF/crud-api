import cluster from 'cluster';
import { PrimaryDBServices } from './PrimaryDBServices';
import { WorkerDBServices } from './WorkerDBServices';

const db = new PrimaryDBServices();

export const connectDB = () =>
  cluster.isPrimary ? db : new WorkerDBServices();
