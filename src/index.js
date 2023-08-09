import express from 'express'
import logger from './config/logger.config.js';
import cookieParser from 'cookie-parser';
import { config} from './config/app.config.js'
import routes from './routes/index.js'
import cors from 'cors';
import dataBaseConnection from './config/db.config.js'

// initiate Database Connection 
dataBaseConnection()

//Init Express
const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(cors('*'));

// Routes
console.log(routes.route)
// v1 api routes
app.use('/v1', routes);

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