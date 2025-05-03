import { Request, Response, NextFunction } from "express";

const registerUser = async (req: Request, res: Response,next: NextFunction) => {
    res.json({
        message: "User registered successfully Ikhlas"
    });
}

export  {registerUser};
