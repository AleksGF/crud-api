type User = {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
};

type DB = {
  users: User[];
};

const db: DB = {
  users: [],
};

export const connectDB = async () => db;
