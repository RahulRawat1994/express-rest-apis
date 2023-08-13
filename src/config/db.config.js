/* eslint-disable no-console */
import mongoose from 'mongoose';
import config from './app.config.js';
import logger from './logger.config.js';

const dataBaseConnection = () => {
   // mongoose.set('useCreateIndex', true);
   // mongoose.set('useFindAndModify', false);

    mongoose.connect(config.MONGODB_URL, { useNewUrlParser:true})
    .then(() => {
        console.info(`Database connected ${config.MONGODB_URL}`)
    })
    .catch(_err => {
        logger.info('app starting error:', _err);
        console.error('App starting error:', config.MONGODB_URL, _err.stack);
        process.exit(1);
    })
}
export default dataBaseConnection;