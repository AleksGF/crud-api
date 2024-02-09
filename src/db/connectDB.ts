import cluster from 'cluster';
import { PrimaryDBServices } from './PrimaryDBServices';

export const connectDB = () =>
  cluster.isPrimary ? new PrimaryDBServices() : new PrimaryDBServices();
