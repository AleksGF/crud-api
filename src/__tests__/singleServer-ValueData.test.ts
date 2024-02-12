import request from 'supertest';
import { workerServer } from '../app';
import { ApiPath, User } from '../types/types';
import { users } from './__mocks/users';

const usersInDB: User[] = [];

describe('Server should correctly work with a lot of users', () => {
  afterAll((done) => {
    workerServer.close(() => {
      done();
    });
  });

  it('should return code 200 and empty array on start', async () => {
    await request(workerServer).get(ApiPath.USERS).expect(200, []);
  });

  it('should add new users by one and return code 201', async () => {
    for await (const user of users) {
      const { body } = await request(workerServer)
        .post(ApiPath.USERS)
        .send(user)
        .expect(201);

      expect(body).toStrictEqual({
        id: expect.any(String),
        ...user,
      });

      usersInDB.push(body);
    }
  });

  it('should update users and return code 200', async () => {
    const { body: allUsers } = await request(workerServer)
      .get(ApiPath.USERS)
      .expect(200);
    expect(allUsers).toStrictEqual(usersInDB);

    const idsUsersToUpdateData = usersInDB
      .filter((_, index) => index % 3 === 0)
      .map((user) => user.id);

    for await (const user of usersInDB) {
      if (idsUsersToUpdateData.includes(user.id)) {
        await request(workerServer)
          .put(`${ApiPath.USERS}/${user.id}`)
          .send({
            username: `updated-username`,
            age: 99,
            hobbies: ['new-hobby'],
          })
          .expect(200);
      }
    }

    const { body: updatedUsers } = await request(workerServer)
      .get(ApiPath.USERS)
      .expect(200);

    expect(updatedUsers).toStrictEqual(
      usersInDB.map((user) => {
        if (idsUsersToUpdateData.includes(user.id)) {
          return {
            id: user.id,
            username: `updated-username`,
            age: 99,
            hobbies: ['new-hobby'],
          };
        }

        return user;
      }),
    );
  });

  it('should delete users and return code 204', async () => {
    const { body: allUsers } = await request(workerServer)
      .get(ApiPath.USERS)
      .expect(200);
    expect(allUsers).toHaveLength(usersInDB.length);

    for await (const user of usersInDB) {
      if (usersInDB.indexOf(user) % 2 === 0) {
        await request(workerServer)
          .delete(`${ApiPath.USERS}/${user.id}`)
          .expect(204);
      }
    }

    const { body: restOfUsers } = await request(workerServer)
      .get(ApiPath.USERS)
      .expect(200);
    expect(restOfUsers).toHaveLength(
      usersInDB.filter((_, index) => index % 2 !== 0).length,
    );
  });
});
