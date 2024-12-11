import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return next(errorHandler(400, "All fields are required"));
  }

  try {
    // Hash the password
    const hashedPassword = bcryptjs.hashSync(password, 10);

    // Create a new user instance
    const newUser = new User({ username, email, password: hashedPassword });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: "User Created Successfully" });
  } catch (error) {
    if (error.code === 11000) {
      return next(errorHandler(409, "Email or Username already exists"));
    }
    next(error); // Forward other errors to middleware
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "User Not Found"));
    }

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(401, "Wrong Password"));
    }

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const { password: hashedPassword, ...rest } = validUser._doc;

    res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Secure only in production
        expires: new Date(Date.now() + 3600000),
      })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  try {
    const { email, name, photoURL } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      const generatedPassword = `${Math.random()
        .toString(36)
        .slice(-8)}${Math.random().toString(36).slice(-8)}`;
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

      user = new User({
        username: `${name.split(" ").join("").toLowerCase()}${Math.random()
          .toString(36)
          .slice(-4)}`,
        email,
        password: hashedPassword,
        profilePicture: photoURL,
      });

      await user.save();
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const { password: hashedPassword, ...rest } = user._doc;

    res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expires: new Date(Date.now() + 3600000),
      })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};
