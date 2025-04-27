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

#### Running with Docker Compose

- TODO

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


