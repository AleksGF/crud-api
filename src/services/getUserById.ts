import { connectDB } from '../db/connectDB';
import { User } from '../types/types';

export const getUserById = async (userId: string): Promise<User | null> => {
  const db = await connectDB();

  return db.users.find((user) => user.id === userId) ?? null;
};
