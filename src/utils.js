import fs from 'fs';
import jwt from 'jsonwebtoken';

export const errorWrapper =({errors, status=500, message='Something went wrong!'})=>{
  return {
    status,
    errors,
    data: {message}
  }
}
export const successWrapper = ({result, status=200}) =>{
  return {
    data:result,
    status,
  }
}

/**
 * Create a new jwt token 
 * @param {Object} user User object
 * @param {String} secret Jwt Secret
 * @param {String|Number} expiresIn Expiration date for jwt token
 * @returns {String} Return generated token 
 */
export const createJwtToken = async (user, secret, expiresIn) => {
  const { id, email, username } = user;
  const token = await jwt.sign({ id, email, username }, secret, {
      expiresIn,
  });

  return token;
};


/**
 * Store file in the upload directory
 * @param {Object} { stream, filename } 
 * @requires Promise Return promise object 
 */
export const storeFile = ({ stream, filename }) => {

  const path = `${config.UPLOAD_DIR}/${filename}`

  return new Promise((resolve, reject) => {
      stream.on('error', error => {
          if (stream.truncated) {
              // Delete the truncated file.
              fs.unlinkSync(path)
          }
          reject(error)
      })
      .pipe(fs.createWriteStream(path))
      .on('error', error => reject(error))
      .on('finish', () => resolve({ path }))
  })
}

export const processUpload = async upload => {
  const { createReadStream, filename, mimetype } = await upload
  const stream = createReadStream()
  const { id, path } = await storeFile({ stream, filename })

  return { id, filename, mimetype, path }
}

/**
* Generate randon string 
* @returns {String} random string characters
*/
export const randomString = () => Math.random().toString(36)
.substr(2);

/**
* Genearte random string token 
* @returns {String} token
*/
export const randomStrToken = () => randomString() + randomString();
