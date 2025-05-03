import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import User from "./userModel";
import bcrypt from "bcrypt"
import { sign } from "jsonwebtoken";
import { config } from "../config/config";

const registerUser = async (req: Request, res: Response,next: NextFunction) => {
    const {username, email, password} = req.body;

    if(!username || !email || !password){
        const error = createHttpError(400, "All fields are required");
        return next(error);
    }
    const user = await User.findOne({email})
    if (user) {
        const error = createHttpError(400, "User already exists with this email");
        return next(error);
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const usercreated = await User.create({username, email, password:hashedPassword});


    const token = sign({userId: usercreated._id},config.jwtSecrete as string, {expiresIn: "7d"});
    res.json({
        accessToken: token,
        message: "User registered successfully Ikhlas"
    });
}

export  {registerUser};
