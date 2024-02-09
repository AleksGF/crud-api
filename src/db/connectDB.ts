import cluster from 'cluster';
import { PrimaryDBServices } from './PrimaryDBServices';

const db = new PrimaryDBServices();

export const connectDB = () =>
  cluster.isPrimary ? db : new PrimaryDBServices();
