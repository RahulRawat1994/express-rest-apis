/* eslint-disable no-console */
import mongoose from 'mongoose';
import config from './app.config.js';

const dataBaseConnection = () => {
   // mongoose.set('useCreateIndex', true);
   // mongoose.set('useFindAndModify', false);

    mongoose.connect(config.DB_CONN_STR, { useNewUrlParser:true})
    .then(() => {
        console.info(`Database connected ${config.DB_CONN_STR}`)
    })
    .catch(_err => {
        console.error('App starting error:', _err.stack);
        process.exit(1);
    })
}
export default dataBaseConnection;