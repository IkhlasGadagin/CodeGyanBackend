import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import { config } from "../config/config";
import jwt from "jsonwebtoken";

const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    console.log("the INSIDE headers");
    
    const token = req.headers.authorization;
    if (!token) {
        return next(createHttpError(401, "Unauthorized"));
    }
    const tokenString = token.split(" ")[1];
    const decoded = jwt.verify(tokenString, config.jwtSecrete as string);
    console.log(decoded, "the decoded token");
    if(!decoded) {
        return next(createHttpError(401, "Unauthorized"));
    }
    // req.user = decoded;
    next();
}

export default authenticate;

