import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;

    try {
        // Hash the password
        const hashedPassword = bcryptjs.hashSync(password, 10);

        // Create a new user instance
        const newUser = new User({ username, email, password: hashedPassword });

        // Save the user to the database
        await newUser.save();

        res.status(201).json({
            message: 'User Created Successfully'
        });
    } catch (error) {
        next(error); // Forward error to middleware
    }
};

export const signin = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists
        const validUser = await User.findOne({ email });
        if (!validUser) {
            return next(errorHandler(404, 'User Not Found'));
        }

        // Validate the password
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) {
            return next(errorHandler(401, 'Wrong Password'));
        }

        // Generate JWT token
        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Exclude sensitive data before sending response
        const { password: hashedPassword, ...rest } = validUser._doc;

        // Set cookie with token
        res.cookie('access_token', token, { httpOnly: true, expires: new Date(Date.now() + 3600000) })
            .status(200)
            .json(rest);

    } catch (error) {
        next(error); // Forward error to middleware
    }
};

export const google = async (req, res, next) => {
    try {
        // Find the user by email
        const user = await User.findOne({ email: req.body.email });

        if (user) {
            // If user exists, generate a token and send the response
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

            const { password: hashedPassword, ...rest } = user._doc;

            res.cookie('access_token', token, { httpOnly: true, expires: new Date(Date.now() + 3600000) })
                .status(200)
                .json(rest);
        } else {
            // If user doesn't exist, create a new user
            const generatedPassword = `${Math.random().toString(36).slice(-8)}${Math.random().toString(36).slice(-8)}`;
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

            const newUser = new User({
                username: `${req.body.name.split(' ').join('').toLowerCase()}${Math.random().toString(36).slice(-8)}`,
                email: req.body.email,
                password: hashedPassword,
                profilePicture: req.body.photoURL
            });

            // Save the new user
            await newUser.save();

            // Generate a token
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

            const { password: hashedPassword2, ...rest } = newUser._doc;

            res.cookie('access_token', token, { httpOnly: true, expires: new Date(Date.now() + 3600000) })
                .status(200)
                .json(rest);
        }
    } catch (error) {
        next(error); // Forward error to middleware
    }
};
