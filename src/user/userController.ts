import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import User from "./userModel";
import bcrypt from "bcrypt"
import { sign } from "jsonwebtoken";
import { config } from "../config/config";
import { User as UserType } from "./userTypes";

const registerUser = async (req: Request, res: Response, next: NextFunction) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        const error = createHttpError(400, "All fields are required");
        return next(error);
    }

    try {
        const user = await User.findOne({ email })
        if (user) {
            const error = createHttpError(400, "User already exists with this email");
            return next(error);
        }
    } catch (error) {
        return next(createHttpError(500, "Error while getting user"))
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let newUser: UserType;
    try {

        newUser = await User.create({ username, email, password: hashedPassword });
    } catch (error) {
        return next(createHttpError(500, "Error while creating user"))

    }


    try {
        const token = sign({ userId: newUser._id }, config.jwtSecrete as string, { expiresIn: "7d" });
        res.json({
            accessToken: token,
            message: "User registered successfully Ikhlas"
        });
    } catch (error) {
        return next(createHttpError(500, "Error while generating token"))
    }
}

export { registerUser };
