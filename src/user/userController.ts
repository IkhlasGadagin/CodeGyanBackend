import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";

const registerUser = async (req: Request, res: Response,next: NextFunction) => {
    const {username, email, password} = req.body;
    if(!username || !email || !password){
        return next(createHttpError(400, "All fields are required"));
    }
    res.json({
        message: "User registered successfully Ikhlas"
    });
}

export  {registerUser};
