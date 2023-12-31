import { NextFunction, Request, Response } from "express";
import User from "../models/user.js";
import { hash, compare } from "bcrypt";
import { createToken } from "../utils/token-manager.js";
import { COOKIE_NAME } from "../utils/constants.js";
export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.find();
    return res.status(200).json({ message: "OK", users });
  } catch (error) {
    console.log(error);
    return res.status(200).json({ message: "Error", cause: error.message });
  }
};

export const userSignup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //user signup
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(401)
        .json({ message: "Error", cause: "User already exists" });
    }
    const hashedPassword = await hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    // create token and store cookie
    res.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      signed: true,
      path: "/",
      secure: true,
      sameSite: 'none'
    });

    const token = createToken(user._id.toString(), user.email, "7d");
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    res.cookie(COOKIE_NAME, token, {
      path: "/",
      expires,
      httpOnly: true,
      signed: true,
        secure: true,
        sameSite: 'none'
    });

    return res
      .status(201)
      .json({ message: "OK", name: user.name, email: user.email, token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error", cause: error.message });
  }
};

export const userLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //user login
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send("User not registered");
    }
    const isPasswordCorrect = await compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(403).send("Incorrect password");
    }
    res.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      signed: true,
      path: "/",
      secure: true,
      sameSite: 'none'
    });

    const token = createToken(user._id.toString(), user.email, "7d");
    console.log(token);
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    res.cookie(COOKIE_NAME, token, {
      path: "/",
      expires,
      httpOnly: true,
      signed: true,
        secure: true,
        sameSite: 'none'
    });

    return res
      .status(201)
      .json({ message: "OK", name: user.name, email: user.email });
  } catch (error) {
    console.log("hello", error);
    return res.status(500).json({ message: "Error", cause: error.message });
  }
};

export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //user token check
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).send("User not registered or token malfunction");
    }
    console.log(user._id.toString(), res.locals.jwtData.id);
    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).send("Permissions not granted");
    }

    return res
      .status(201)
      .json({ message: "OK", name: user.name, email: user.email });
  } catch (error) {
    console.log("hello", error);
    return res.status(500).json({ message: "Error", cause: error.message });
  }
};

export const userLogout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //user token check
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).send("User not registered or token malfunction");
    }
    console.log(user._id.toString(), res.locals.jwtData.id);
    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).send("Permissions not granted");
    }

    res.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      signed: true,
      path: "/",
        secure: true,
        sameSite: 'none'
    });

    return res
      .status(201)
      .json({ message: "OK", name: user.name, email: user.email });
  } catch (error) {
    return res.status(500).json({ message: "Error", cause: error.message });
  }
};
