import express from 'express'
import cors from 'cors';
import helmet from 'helmet'
import compression from 'compression'
import mongoSanitize from 'express-mongo-sanitize'
import cookieParser from 'cookie-parser';

import httpStatus from 'http-status'
import ApiError from './utils/ApiError.js';
import logger from './config/logger.config.js';
import config from './config/app.config.js'
import routes from './routes/index.js'
import dataBaseConnection from './config/db.config.js'
import { errorConverter, errorHandler } from './middlewares/error.js'
// initiate Database Connection 
dataBaseConnection()

//Init Express
const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(cors('*'));

// set security HTTP headers
app.use(helmet());

// sanitize request data
app.use(mongoSanitize());

// gzip compression
//app.use(compression());

// Routes v1 api routes
app.use('/v1', routes);
// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});
// convert error to ApiError, if needed
app.use(errorConverter);
// handle error
app.use(errorHandler);



let server;
server = app.listen(config.PORT || 3001, () => {
  console.log(`listening on port ${config.PORT}`);
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});