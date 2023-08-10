import jwt from 'jsonwebtoken';
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

export const generateRandomValue =(length, options = { useNumbers: true, useLetters: true }) =>{
  const characters = options.useLetters ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz' : '';
  const numbers = options.useNumbers ? '0123456789' : '';

  const allowedCharacters = characters + numbers;
  const allowedCharactersLength = allowedCharacters.length;

  let randomValue = '';

  for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * allowedCharactersLength);
      randomValue += allowedCharacters.charAt(randomIndex);
  }

  return randomValue;
}


export const generateRandomOtp = (length) =>{
  const characters = '0123456789';
  let otp = '';

  for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      otp += characters[randomIndex];
  }

  return otp;
}
/**
 * Create an object composed of the picked object properties
 * @param {Object} object
 * @param {string[]} keys
 * @returns {Object}
 */
export const pick = (object, keys) => {
  return keys.reduce((obj, key) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      // eslint-disable-next-line no-param-reassign
      obj[key] = object[key];
    }
    return obj;
  }, {});
};

