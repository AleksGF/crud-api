import { User } from '../types/types';

type DB = {
  users: User[];
};

const db: DB = {
  users: [],
};

export const connectDB = async () => db;
