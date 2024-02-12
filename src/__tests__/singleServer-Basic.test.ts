import request from 'supertest';
import { randomUUID } from 'crypto';
import { workerServer } from '../app';
import { ApiPath, HttpStatusMessages, User } from '../types/types';
import { singleUser } from './__mocks/users';

let user: User;

describe('Server should correctly work', () => {
  beforeAll((done) => {
    request(workerServer)
      .post(ApiPath.USERS)
      .send(singleUser)
      .then((res) => {
        user = res.body as User;
        done();
      });
  });

  afterAll((done) => {
    workerServer.close(() => {
      done();
    });
  });

  it('answer with status code 200 on correct GET', async () => {
    await request(workerServer).get(ApiPath.USERS).expect(200);
  });

  it('answer with status code 200 and record with id === userId on correct GET', async () => {
    await request(workerServer)
      .get(`${ApiPath.USERS}/${user.id}`)
      .expect(200, user);
  });

  it('answer with status code 400 and corresponding message if userId is invalid (not uuid)', async () => {
    await request(workerServer)
      .get(`${ApiPath.USERS}/${user.id + 'a'}`)
      .expect(400, HttpStatusMessages.ID_NOT_VALID_400);
  });

  it('answer with status code 404 and corresponding message if record with not existing id', async () => {
    let invalidId: `${string}-${string}-${string}-${string}-${string}`;

    do {
      invalidId = randomUUID();
    } while (invalidId === user.id);

    await request(workerServer)
      .get(`${ApiPath.USERS}/${invalidId}`)
      .expect(404, HttpStatusMessages.NO_USER_FOUND_404);
  });

  it('answer with status code 201 and newly created record', async () => {
    const { body: newUser } = await request(workerServer)
      .post(ApiPath.USERS)
      .send(singleUser)
      .expect(201);

    expect(newUser).toEqual({ id: expect.any(String), ...singleUser });

    const { body: allUsers } = await request(workerServer)
      .get(ApiPath.USERS)
      .expect(200);

    expect(allUsers).toHaveLength(2);
  });

  it('answer with status code 400 and corresponding message if request body new user does not contain required fields', async () => {
    const notStringTypeValue = 1;

    await request(workerServer)
      .post(ApiPath.USERS)
      .send({ username: singleUser.username, age: singleUser.age })
      .expect(400, HttpStatusMessages.USER_DATA_NOT_VALID_400);

    await request(workerServer)
      .post(ApiPath.USERS)
      .send({
        username: singleUser.username,
        age: singleUser.age,
        hobbies: 'invalid',
      })
      .expect(400, HttpStatusMessages.USER_DATA_NOT_VALID_400);

    await request(workerServer)
      .post(ApiPath.USERS)
      .send({
        username: singleUser.username,
        age: singleUser.age,
        hobbies: [...singleUser.hobbies, notStringTypeValue],
      })
      .expect(400, HttpStatusMessages.USER_DATA_NOT_VALID_400);
  });

  it('answer with status code 200 and updated record on correct PUT', async () => {
    const updatedUser = {
      username: 'UpdatedUserName',
      age: 99,
      hobbies: [],
    };

    await request(workerServer)
      .put(`${ApiPath.USERS}/${user.id}`)
      .send(updatedUser)
      .expect(200, { id: user.id, ...updatedUser });
  });

  it('answer with status code 400 and corresponding message if userId is invalid (not uuid)', async () => {
    await request(workerServer)
      .put(`${ApiPath.USERS}/${user.id + 'a'}`)
      .send(user)
      .expect(400, HttpStatusMessages.ID_NOT_VALID_400);
  });

  it('answer with status code 404 and corresponding message if record with not existing id', async () => {
    const { body: users } = await request(workerServer)
      .get(ApiPath.USERS)
      .expect(200);

    let invalidId: `${string}-${string}-${string}-${string}-${string}`;

    do {
      invalidId = randomUUID();
    } while ((users as User[]).map((user) => user.id).includes(invalidId));

    await request(workerServer)
      .put(`${ApiPath.USERS}/${invalidId}`)
      .send(users[0])
      .expect(404, HttpStatusMessages.NO_USER_FOUND_404);
  });

  it('answer with status code 204 if the record is found and deleted', async () => {
    const { body: users } = await request(workerServer)
      .get(ApiPath.USERS)
      .expect(200);

    const userIdToDelete = (users as User[]).filter(
      (currentUser) => currentUser.id !== user.id,
    )[0].id;

    await request(workerServer)
      .delete(`${ApiPath.USERS}/${userIdToDelete}`)
      .expect(204);

    const { body: restUsers } = await request(workerServer)
      .get(ApiPath.USERS)
      .expect(200);

    expect(restUsers).toHaveLength(1);
  });

  it('answer with status code 400 and corresponding message if userId is invalid (not uuid)', async () => {
    await request(workerServer)
      .delete(`${ApiPath.USERS}/aaa-aa`)
      .expect(400, HttpStatusMessages.ID_NOT_VALID_400);
  });

  it('answer with status code 404 and corresponding message if record with not existing id', async () => {
    let invalidId: `${string}-${string}-${string}-${string}-${string}`;

    do {
      invalidId = randomUUID();
    } while (invalidId === user.id);

    await request(workerServer)
      .delete(`${ApiPath.USERS}/${invalidId}`)
      .expect(404, HttpStatusMessages.NOT_FOUND_404);
  });

  it('answer with status code 404 when non-existing endpoints', async () => {
    await request(workerServer)
      .get('/wrong/endpoint')
      .expect(404, HttpStatusMessages.NOT_FOUND_404);
    await request(workerServer)
      .get('/')
      .expect(404, HttpStatusMessages.NOT_FOUND_404);
  });
});
