import { UserModel } from "../models/usermodel.mjs";

import { 
   userSignUpValidator,
    userUpdateValidator,
    userSignInValidator
} from "../validators/uservalidator.mjs";


//External libraries
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


//user sign up
export const userSignUp = async (req, res, next) => {
    try {
        //validate userinput
        const { error, value} = userSignUpValidator.validate(req.body);
        if (error){
            return res.status(422).json({
                error: error.details
            })
        }

        // Check if the email exists already
        const existingUser = await UserModel.findOne({ email: value.email });
        if (existingUser) {
            return res.status(409).json("You already have an account, log in instead");
        }
    
        // Hash password before saving to database
        const hashedPassword = bcrypt.hashSync(value.password, 10);

        //Save||User to database
        const newUser = await UserModel.create({
            ...value,
            password: hashedPassword,
        });

        // Respond to the request
        return res.status(201).json({
            message: "User successfully registered!",
            user: newUser});


    } catch (error) {
        next(error)
    }
}


//user login controller
export const userSignIn = async (req, res, next) => {
    try {
        //validate login user request
        const { error, value } = userSignInValidator.validate(req.body);
        if (error) {
            res.status(422).json({ error: error.details });
        }
        //Find if User exist already
        const user = await UserModel.findOne({ email: value.email });
        if (!user) {
            res.status(404).json("User not found");
        }
        // check if value.password match db password
        const correctPassword = bcrypt.compare(value.password, user.password);
        if (!correctPassword) {
            res.status(404).json("Invalid User Credentials");
        }
        // if value.password matches db user password, enable session|token
        const session = jwt.sign(
            {
                id: user.id, email: user.email
            },
            process.env.JWT_PRIVATE_KEY,
            {
                expiresIn: "24h",
            });
        //get current timestamp for user login attempt
        // const loginTime = new Date().toLocaleString();

        // respond to request
        return res.status(200).json(
            {
                message: 'User logged in!',
                accessToken: session
            }
        );
    }
    catch (error) {
        next(error);
    }
};


export const userUpdate = async (req, res, next) => {
    try {
        // Validate user input
        const { error, value } = userUpdateValidator.validate(req.body);
        if (error) {
            return res.status(422).json({
                error: error.details
            });
        }

        // Get user ID from req.auth
        const userId = req.auth.user.id;

        // Find the user by ID
        const existingUser = await UserModel.findById(userId);
        if (!existingUser) {
            return res.status(404).json("User not found");
        }

        // Check if the email is being updated and if it already exists
        if (value.email && value.email !== existingUser.email) {
            const emailExists = await UserModel.findOne({ email: value.email });
            if (emailExists) {
                return res.status(409).json("Email is already in use");
            }
        }

        // Update password if it's provided
        if (value.password) {
            value.password = bcrypt.hashSync(value.password, 10); // Hash the new password
        }

        // Update user information
        await UserModel.findByIdAndUpdate(userId, value, { new: true });

        // Respond to the request
        return res.status(200).json({
            message: "User information updated successfully!",
        });

    } catch (error) {
        next(error);
    }
}