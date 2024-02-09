import { v4 as uuidv4 } from 'uuid';
import { User, DBServices, UserWithoutId } from '../types/types';

//TODO: Remove it
const users: User[] = [];

for (let i = 0; i < 20; i++) {
  const id = uuidv4();

  users.push({
    id,
    username: `UserName${i}`,
    age: 20 + i,
    hobbies: [`test${i}`],
  });
}

export class PrimaryDBServices implements DBServices {
  private readonly users: User[];

  constructor() {
    this.users = users;
  }

  public async getUsers() {
    return this.users;
  }

  public async getUserById(id: string) {
    return this.users.find((user) => user.id === id);
  }

  public async createUser(newUser: UserWithoutId) {
    const id = uuidv4();
    const { username, age, hobbies } = newUser;
    const user = { id, username, age, hobbies };
    this.users.push(user);

    return user;
  }
}
