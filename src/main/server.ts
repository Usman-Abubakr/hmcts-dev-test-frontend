#!/usr/bin/env node
import * as fs from 'fs';
import * as https from 'https';
import * as path from 'path';

import { app } from './app';

let httpsServer: https.Server | null = null;

// used by shutdownCheck in readinessChecks
app.locals.shutdown = false;

// TODO: set the right port for your application
const port: number = parseInt(process.env.PORT || '3100', 10);

const swaggerjsdoc = require ("swagger-jsdoc")
const swaggerui = require("swagger-ui-express")
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "hmcts-dev-test api",
      version: "0.1",
      description: "API documentation for hmcts-dev-test, ensure Java Spring application is runnning before accessing this endpoint. !Try it out feature currently not working",
    },
    servers: [
      {
        // url: "https://localhost:3100",
        url: process.env.SPRING_API_BASE_URL || "http://localhost:4000",
      },
    ],
  },
  apis: ["./src/main/routes/*.ts"],
};

const spacs = swaggerjsdoc(options)

app.use(
  "/api-docs",
  swaggerui.serve,
  swaggerui.setup(spacs)
  
)

if (app.locals.ENV === 'development') {
  const sslDirectory = path.join(__dirname, 'resources', 'localhost-ssl');
  const sslOptions = {
    cert: fs.readFileSync(path.join(sslDirectory, 'localhost.crt')),
    key: fs.readFileSync(path.join(sslDirectory, 'localhost.key')),
  };
  httpsServer = https.createServer(sslOptions, app);
  httpsServer.listen(port, () => {
    console.log(`Application started: https://localhost:${port}`);
  });
} else {
  app.listen(port, () => {
    console.log(`Application started: http://localhost:${port}`);
  });
}

function gracefulShutdownHandler(signal: string) {
  console.log(`⚠️ Caught ${signal}, gracefully shutting down. Setting readiness to DOWN`);
  // stop the server from accepting new connections
  app.locals.shutdown = true;

  setTimeout(() => {
    console.log('Shutting down application');
    // Close server if it's running
    httpsServer?.close(() => {
      console.log("HTTPS server closed")
    });
  }, 4000);
}

process.on('SIGINT', gracefulShutdownHandler);
process.on('SIGTERM', gracefulShutdownHandler);
