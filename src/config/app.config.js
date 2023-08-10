import 'dotenv/config';

export default {
  env             : process.env.ENV,
  PORT            : process.env.PORT || 3000,
  DB_CONN_STR     : process.env.DB_CONN_STR,
  SECRET          : process.env.SECRET,
  ADMIN_ROLE      : process.env.ADMIN_ROLE,
  DEFAULT_ROLE    : process.env.DEFAULT_ROLE,
  UPLOAD_DIR      : process.env.UPLOAD_DIR,
  // Mail 
  MAIL_SERVICE_HOST   : process.env.MAIL_SERVICE_HOST,
  MAIL_SERVICE_SECURE : process.env.MAIL_SERVICE_SECURE,
  MAIL_SERVICE_PORT   : process.env.MAIL_SERVICE_PORT,
  MAIL_USER_NAME      : process.env.MAIL_USER_NAME,
  MAIL_USER_PASSWORD  : process.env.MAIL_USER_PASSWORD,
}