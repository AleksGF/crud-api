import { agent } from 'supertest';
import { workerServer } from '../app';
import {
  ApiPath,
  HttpStatusMessages,
  User,
  UserWithoutId,
} from '../types/types';
import { singleUser } from './__mocks/users';

const request = agent(workerServer);

describe('Server should correctly work with simple scenario', () => {
  afterAll((done) => {
    workerServer.close(() => {
      done();
    });
  });

  it('should work correctly', async () => {
    // Get all records with a GET api/users request (an empty array is expected)
    await request.get(ApiPath.USERS).expect(200, []);

    // A new object is created by a POST api/users request (a response containing newly created record is expected)
    const { body: user } = await request
      .post(ApiPath.USERS)
      .send(singleUser)
      .expect(201);
    expect(user).toEqual({ id: expect.any(String), ...singleUser });

    // With a GET api/user/{userId} request, we try to get the created record by its id (the created record is expected)
    await request.get(`${ApiPath.USERS}/${user.id}`).expect(200, user);

    // We try to update the created record with a PUT api/users/{userId}request (a response is expected containing an updated object with the same id)
    const updatedUser: UserWithoutId = {
      username: 'Updated',
      age: 17,
      hobbies: [],
    };
    await request
      .put(`${ApiPath.USERS}/${user.id}`)
      .send(updatedUser)
      .expect(200, { id: user.id, ...updatedUser });

    // With a DELETE api/users/{userId} request, we delete the created object by id (confirmation of successful deletion is expected)
    await request.delete(`${ApiPath.USERS}/${user.id}`).expect(204);

    // With a GET api/users/{userId} request, we are trying to get a deleted object by id (expected answer is that there is no such object)
    await request
      .get(`${ApiPath.USERS}/${user.id}`)
      .expect(404, HttpStatusMessages.NO_USER_FOUND_404);
  });
});
