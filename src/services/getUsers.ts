import { connectDB } from '../db/connectDB';
import { User } from '../types/types';

export const getUsers = async (): Promise<User[]> => {
  const db = await connectDB();

  return db.users;
};
