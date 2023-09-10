# web-chat
## Description
Requirement:
>please refer to https://gist.github.com/gerukin/3233e6cfeb21fc56015ad6079d9e8743?fbclid=IwAR2Q2_-nInrwAptBzqh0PCbDzmWlUTv84jiykwJq4EncMKo0kGvOdYzciNs

And here is my choice:

**Client side**:
 I skip it 
 
### Backend

**Database**:
- MySQL (in a separate container)

Backend Option A:

- Typescript
- Node.js:
  - Nest.js, 
  - TypeORM
  - Socket.io

The following are a few reasons why I chose NestJS for this project:

-  TypeScript Support
-  Modular Architecture: It uses decorators and modules to create clean and maintainable code by separating concerns into modules, controllers, services, and more. This helps with code scalability and maintainability.You can easily break down your application into smaller, manageable parts and scale them independently.
-  Websocket Support
-  Dependency Injection: NestJS utilizes a powerful dependency injection system that promotes reusability and testability. This design pattern allows you to inject dependencies into your components, making it easier to manage and test your application.
- Middleware and Interceptors: NestJS provides a robust middleware and interceptor system, allowing you to add cross-cutting concerns to your application, such as logging, authentication, and error handling, in a modular and reusable way.
...

## Installation

```bash
$ cd web-chat
$ docker-compose up -d
```
After running, the database will be automatically  created with the name: **"test"**.

* Note
 if database is not created, you can 
1. Run this command and try it again
```bash
$ docker-compose down -v 
$ docker-compose up -d
```
2. Or open set_database/init.sql, copy and run sql statement

## Enviroment
The environment is configurated in /chat-app-server/.env file. please read and change it if needed or add/update it in docker-compse.yml file

The default port:
 - API port: 4000
 - Websocket port: 4006

## API Doc
After starting application, you can use swagger doc to test(i use it instead of postman)

Example: http://localhost:4000/api-docs

Here the list of API:
1. /api/v1/users
    - Method: Post
    - Create a nickname if not exist and login into system
2. /api/v1/chatrooms
    - Method: Post
    - Create a new room name
3. /api/v1/chatrooms
    - Method: Get
    - Get all chat rooms
4. /api/v1/chatrooms/{id}
    - Method: Delete
    - Delete a exited chat room
5. /api/v1/chatrooms/{id}/users
    - Method: Get
    - Get list of user by room id
6. /api/v1/chatrooms/{id}/messages
    - Method: Get
    - Fetch messages by room Id, page and page size.

**Note**: 
After login system you should copy token and aouthorize it to use other apis, socket event
## Websocket Event
1. joinRoom
    - Subcribe this event when user join a room
2. sendMessage
    - Subcribe this event when user send new/edited message
3. userJoined
    - Broadcast to client when a new user join in a chat room
4. messagedEdited
    - Broadcast to client when a edited message is store into db

For websocket testing
You can open test/user_test1.html and test/user_test2.html
replace token(The token when we call api /api/v1/users) and roomId variable, then open it in browser
(Sorry for this inconvenience)
