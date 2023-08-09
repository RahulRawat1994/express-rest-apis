import {config} from './app.config.js'
import nodeMailer from 'nodemailer';

export const mail = nodeMailer.createTransport({
    host: config.MAIL_SERVICE_HOST,
    port: config.MAIL_SERVICE_PORT,
   // secure: config.MAIL_SERVICE_SECURE,
    auth: {
        // should be replaced with real sender's account
        user: config.MAIL_USER_NAME,
        pass: config.MAIL_USER_PASSWORD
    }
});