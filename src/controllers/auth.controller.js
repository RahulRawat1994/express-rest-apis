import httpStatus from "http-status";
import UserModel from "../models/user.model.js";
import catchAsync from "../utils/catchAsync.js";
import {
  createJwtToken,
  generateRandomValue,
} from "../utils/index.js";
import { mail } from "../config/mail.config.js";
import ApiError from "../utils/ApiError.js";

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
  mail
    .sendMail({
      to: user.email,
      subject: "Reset Password ",
      html,
    })
    .catch((err) => {
      console.log("Error:", err);
    });
};

export default {
  register: catchAsync(async (req, res) => {
    const checkUser = await UserModel.count({ email: req.body.email });
    if (checkUser) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Email already exit");
    }
    const data = req.body;
    if (req.file) {
      data.profile = req.file.path;
    }
    const user = await UserModel.create(data);
    return res.status(201).json({
      data: user,
    });
  }),
  verifyEmail: catchAsync(async (req, res) => {
    if (!req.params.token) {
      return res.send("Invalid Token");
    }
    const user = await UserModel.find({
      resetToken: req.params.token,
    });

    if (!user) {
      return res.send("invalid Token");
    }

    await UserModel.updateOne(
      { resetToken: req.params.token },
      { isEmailVerified: true }
    );
    return res.send("Email verified successfully!!!");
  }),
  login: catchAsync(async (req, res) => {
    const data = {
      email: req.body.email,
      isEmailVerified: true,
    };
    const user = await UserModel.findOneOrFail(data);
    const isValid = await user.validatePassword(req.body.password);

    if (!isValid) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid userId/password");
    }

    const token = await createJwtToken(user, "secret", "30m");

    return res.json({ data: { token } });
  }),
  forgotPassword: catchAsync(async (req, res) => {
    const email = req.body.email;
    const user = await UserModel.findOneOrFail({ email });
    const otp = generateRandomValue(6, { useLetters: false });
    await UserModel.updateOne({ email: user.email }, { otp });
    user.otp = otp;
    sendForgotEmail(user);
    return res.json({
      data: "Reset password email send successfully!!",
    });
  }),
  changePassword: catchAsync(async (req, res) => {
    const data = {
      email: req.body.email,
      password: req.body.password,
      otp: req.body.otp,
    };
    const user = await UserModel.findOneOrFail({
      email: data.email,
      otp: data.otp,
    });
    user.password = data.password;
    user.otp = "";
    await user.save();

    return res.json({ data: "Password updated successfully!!" });
  }),
};
