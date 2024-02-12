import { UserWithoutId } from '../../types/types';

const usersCount = 100;

export const users: UserWithoutId[] = new Array(usersCount)
  .fill(null)
  .map((_, index) => ({
    username: `user${index}`,
    age: 18 + Math.floor(Math.random() * 80),
    hobbies: ['hobby1', 'hobby2', 'hobby3', `hobby-${index}`],
  }));

export const singleUser: UserWithoutId = {
  username: 'singleUser',
  age: 27,
  hobbies: ['hobby1', 'hobby2', 'hobby3', 'hobby4'],
};
