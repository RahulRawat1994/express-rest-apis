import UserModel from '../models/user.js'
import { 
  successWrapper,
  errorWrapper,
  createJwtToken
} from '../utils.js';
import { mail } from '../config/mail.config.js';

const sendForgotEmail = (user) => {
  const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>OTP Email</title>
  </head>
  <body style="font-family: Arial, sans-serif; text-align: center; background-color: #f2f2f2; padding: 20px;">
      <div style="background-color: white; padding: 20px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
  
          <h2>Your OTP Code</h2>
          <p>Use the following One-Time Password (OTP) to complete your verification:</p>
          
          <div style="background-color: #007BFF; color: white; font-size: 24px; padding: 10px 20px; border-radius: 5px;">
              <!-- Insert OTP Number Here -->
              ${user.otp}
          </div>
          
          <p>This OTP is valid for a single use and will expire shortly. Do not share it with anyone.</p>
          
          <p>If you didn't request this OTP, you can safely ignore this email.</p>
          
      </div>
  </body>
  </html>
  
    `;
    mail.sendMail({
        to : user.email,
        subject : 'Reset Password ',
        html
    })
    .catch(err => {
        console.log('Error:', err);
    });
}


const generateRandomOtp = (length) =>{
  const characters = '0123456789';
  let otp = '';

  for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      otp += characters[randomIndex];
  }

  return otp;
}



export default {
    register:async (req, res) => {
      
      const checkUser = await UserModel.count({email:req.body.email});
      console.log(checkUser)
      if(checkUser){
        return res.send(errorWrapper({message:'User already exit', status:400})).status(400)
        
      }

      const data = req.body;
      if(req.file){
        data.profile = req.file.path
      }
      const user = await UserModel.create(data);


      // await UserModel.findOneAndUpdate({
      //     $or:[
      //         {   userName : login   },
      //         {   email : login   }
      //     ]
      // }, { resetToken : randomStrToken() }, { new:true });

      // const html = `
      //     Hi ${user.firstName} ${user.lastName},
      //     <br/>
      //     Token : ${user.resetToken}
      // `;
      // mail.sendMail({
      //     to : user.email,
      //     subject : 'Forgot Password',
      //     html
      // })
      // .catch(err => {
      //     console.log('Error:', err);
      // });
      return res.status(201).send(successWrapper({result:user }));
    },
    verifyEmail:async( req, res ) => {
      if(!req.params.token){
        return res.send('Invalid Token')
      }
      const user = await UserModel.find({
        resetToken: req.params.token
      })

      if(!user){
        return res.send('invalid Token')
      }

      await UserModel.updateOne({resetToken: req.params.token}, {isEmailVerified: true})
      return res.send('Email verified successfully!!!')
    },
    login: async (req, res) =>{
      try {
        const data = {
          email: req.body.email,
          isEmailVerified: true
        }
        
        const user = await UserModel.findOne(data);
        
        if (!user) {
          
          return res.send(errorWrapper({
            status:404,
            message:'Invalid user/password' })
          ).status(404)
        }

        const isValid = await user.validatePassword(req.body.password);

        if (!isValid) {
            res.send(errorWrapper(
              {
                status:404,
                message:'Invalid userId/password' })
            ).status(404)
        }
        
        const token = await createJwtToken(user, 'secret', '30m');
        
        res.send(successWrapper({ result:{token} }))
      } catch(error) {
        console.log(error)
        res.send(errorWrapper(error))
      }

    },
    forgotPassword: async(req,res) => {
      const email = req.body.email
      console.log('sdflksjfkl')
      const user = await UserModel.findOne({email})
      console.log('sdflksjfkl')
      if(!user){
        return res.json(successWrapper(
          {
            status:400,
            message: 'User doesn\'t exist' 
          }
        )).status(400)
      }
      
      const otp = generateRandomOtp(6);
      await UserModel.updateOne({email: user.email}, {otp});
      user.otp = otp;
      sendForgotEmail(user);
      return res.send(successWrapper({result:'Reset password email send successfully!!'}))
    },
    changePassword: async(req, res) =>{
      const data ={
        email: req.body.email,
        password: req.body.password,
        otp: req.body.otp
      }
      console.log(data);
      const user = await UserModel.findOne({ email: data.email,otp:data.otp})
      
      if(!user){
        return res.json(errorWrapper(
          {
            status:400,
            message: 'User not found' 
          }
        )).status(400)
      }

      user.password = data.password
      user.otp =''
      await user.save()

      return res.send(successWrapper({result:'Password updated successfully!!'}))
    }
}