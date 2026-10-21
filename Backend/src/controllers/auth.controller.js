import UserModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import emailServices from "../services/email.service.js";

/**
 * - user register controller
 * - POST /api/auth/register
 */
async function userRegisterController(req, res) {
  const { email, password, name } = req.body;

  const isExists = await UserModel.findOne({
    email,
  });

  if (isExists) {
    return res.status(422).json({
      message: "User already exists with email.",
      status: "failed",
    });
  }

  const user = await UserModel.create({
    email,
    password,
    name,
  });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });

  res.cookie("token", token);

  try {
    await emailServices.sendRegistrationEmail(user.email, user.name);
  } catch (error) {
    console.error("Failed to send registration email:", error);
  }

  res.status(201).json({
    user: {
      _id: user._id,
      email: user.email,
      name: user.name,
    },
    token,
  });
}

/**
 * - user login controller
 * - POST /api/auth/login
 */
async function userLoginController(req, res) {
  const { email, password } = req.body;

  const user = await UserModel.findOne({
    email: email.trim().toLowerCase(),
  }).select("+password");

  if (!user) {
    return res
      .status(401)
      .json({ message: "User does not exist ", status: "failed" });
  }

  // `comparePassword` belongs to this user document, not to UserModel.
  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    return res
      .status(401)
      .json({ message: "Invalid password", status: "failed" });
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });
  res.cookie("token", token);

  res.status(200).json({
    message: "User login successfully",
    status: "success",
    user: { _id: user._id, email: user.email, name: user.name },
    token,
  });
}

export default { userRegisterController, userLoginController };
