# crud-api - Simple Server Application

Instructions:
1. Download app from [GitHub](https://github.com/AleksGF/crud-api) or clone [repository](https://github.com/AleksGF/crud-api.git). Use `develop` branch (`git checkout -b develop origin/develop`).
2. Run `npm install` in repository folder to install dependencies.
3. Add file `.env` with content `PORT=4000` (or other port number). Sometimes you need restart your IDE after adding env;
4. You can use scripts to run in dev mode or build product bundle. Commands for NPM:
- `npm run build` makes production bundle in 'dist' folder;
- `npm run start:dev` starts single server in dev mode;
- `npm run start:multi` starts multiserver application (you need to have multi-cores CPU);
- `npm run start:prod` makes production bundle and starts single server;
- `npm run test` starts available tests suits
5. After starting server(s) you can get access to it(them) with url `localhost:4000` (or other chosen port number, worker servers would run on next numbers ports - see app console to get port numbers). To test api you can use [Postman](https://www.postman.com/) or any other utility;
6. You can use endpoints:
- `/api/users` to GET all users, POST new user;
- `/api/users/:id` to GET user with id, PUT user change data, DELETE user.
