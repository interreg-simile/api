import express from "express";

import { startServer } from "./setup/server";
import { connectDb, onDbConnectionError } from "./setup/database";
import { setupMiddlewares } from "./setup/middlewares";
import { setupRoutes } from "./setup/routes";

// Create an express server
const server = express();

// Setup the middlewares
setupMiddlewares(server);

// Setup the routes
setupRoutes(server);

// Connect to the database and start the server
connectDb()
    .then(() => startServer(server))
    .catch(err => onDbConnectionError(err));
