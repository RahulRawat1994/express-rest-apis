import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import {config} from '../config/app.config.js';
import {mail} from '../config/mail.config.js';
import { 
  randomStrToken
} from '../utils.js';
const userSchema = mongoose.Schema(
  {
    name:{
      type: String,
      required: true,
      trim: true,
    },
    email:{
      type: String,
      required: true,
      trim:true,
      unique:true,
      validate: {
          // eslint-disable-next-line prefer-named-capture-group
          validator: v => (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,4})+$/u).
          test(v,),
          message: '{VALUE} is not a valid email!',
      },
    },
    password:{
      type:String,
      required: true,
      minlength:6,
      maxlength:66,
    },
    profile:{
      type: String,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    resetToken:{
      type: String
    },
    otp:{
      type:String,
      maxlength:10
    }
  },
  {
    timestamps: true,
  }
)

userSchema.pre('save', async function() {
  this.password = await this.generatePasswordHash();
  this.resetToken = randomStrToken()
});
userSchema.post('save', async function (doc) {
  this.sendVerificationEmail(doc);
})

userSchema.methods.sendVerificationEmail = async function (doc) {
    const html = `
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Verification</title>
      </head>
      <body>
          <div style="text-align: center; padding: 50px;">
              <h2>Welcome to Our Website!</h2>
            
              <p>Please click the button below to verify your email address:</p>
              <a href="http://localhost:${config.PORT}/v1/verify-email/${doc.resetToken}" style="display: inline-block; padding: 10px 20px; background-color: #007BFF; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify Email</a>
              <p>If you didn't request this email, you can safely ignore it.</p>
          </div>
      </body>
      </html>
    `;
    mail.sendMail({
        to : doc.email,
        subject : 'Verify link',
        html
    })
    .catch(err => {
        console.log('Error:', err);
    });
}

userSchema.methods.generatePasswordHash = async function() {
  const saltRounds = 10;
  const hash = await bcrypt.hash(this.password, saltRounds);

  return hash;
};

userSchema.methods.validatePassword = async function(password) {
  console.log(password)
  const checkPassword = await bcrypt.compare(password, this.password);
  return checkPassword;
};

/**
 * @typedef User
 */
const User = mongoose.model('User', userSchema);
export default User;