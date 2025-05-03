import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import User from "./userModel";

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
    const usercreted = await User.create({username, email, password});
    if (usercreted) {
        res.status(201).json({
            message: "User registered successfully",
            user: usercreted
        });
    }


    res.json({
        message: "User registered successfully Ikhlas"
    });
}

export  {registerUser};
