import mongoose from 'mongoose'
import httpStatus from 'http-status'
import config from '../config/app.config.js'
import logger from '../config/logger.config.js'
import ApiError  from '../utils/ApiError.js'

export const errorConverter = (err, _req, _res, next) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode || error instanceof mongoose.Error ? httpStatus.BAD_REQUEST : httpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || httpStatus[statusCode];
    error = new ApiError(statusCode, message,[], false, err.stack);
  }
  next(error);
};

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, _req, res, _next) => {
  let { statusCode, message } = err;
  
  if (config.env === 'production' && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
  }

  res.locals.errorMessage = err.message;

  const response = {
    code: statusCode,
    message,
    ...(config.env === 'development' && { stack: err.stack }),
  };

  if(err.errors){
    response.errors = err.errors;
  }

  if (config.env === 'development') {
    logger.error(err);
  }

  res.status(statusCode).send(response);
};