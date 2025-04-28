# HMCTS Dev Test Backend

This project is a simple task management web application for case managers.

It can display, create, update, and delete tasks.

It is designed to demonstrate the use of modern web development technologies and best practices.

## How it's made

This project makes use of Node.js, Express.js, and TypeScript for the website backend and Nunjucks for the front-end templating.

It is made to be used in combination with the Spring application backend to manage tasks, with error handling and responses to ensure a smooth user experience.

---

## Tech Stack

- Node.js
- Express.js
- TypeScript
- Nunjucks
- Docker & Docker Compose

---

## How to Run

### Docker:

#### Prerequisites

- Docker & Docker Compose

#### Running with Docker Compose (Backend only)

- `docker-compose up --build`
- Accessible by default on `http://localhost:3100`
- Ports and database details can be updated by editing `Dockerfile` and `docker-comepose.yml`

#### Running with Docker Compose (Backend + Frontend)

1. Create a folder called `hmcts-dev-test` and clone this repository and the [frontend](https://github.com/Usman-Abubakr/hmcts-dev-test-frontend)
2. In the new folder, create a new docker network with `docker network create hmcts-network`
3. Copy `docker-compose.yml.example` from this project into the new folder and rename to `docker-compose.yml`
4. Run `docker-compose up --build`, the project should be accessible on https://localhost:3100/

- The Project structure should look similar like this:
```
hmcts-dev-test/
│
├── hmcts-dev-test-backend/
│   ├── docker-compose.yml.example  ← (ignore if copied from front project)
│   ├── src/
│   └── Dockerfile
│
├── hmcts-dev-test-frontend/
│   ├── docker-compose.yml.example  ← (copy and rename this to `docker-compose.yml` into the root)
│   ├── src/
│   └── Dockerfile
│
└── docker-compose.yml  ← (new file here, after copying example)
```


### Local:

#### Build & Run

To begin with, you should be able to run this by running:
1) `yarn install`
2) `yarn webpack`
3) `yarn start:dev` or navigate to package.json and run the script manually

Once the server is running, it can be accessed at: https://localhost:3100 (port can be changed in server.ts), remember to also run the Spring application if you wish to use the task feature (recommended)

### Testing

A Swagger UI is also available at: https://localhost:3100/api-docs/

---

## Improvements

Here are some features and improvements that could be made, which did make it due to time constrains and scope of project:

- Log in
- Complete testing
- Fix Swagger Documentation
- Data sanitisation


