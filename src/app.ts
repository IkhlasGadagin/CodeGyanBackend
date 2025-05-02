import express, { NextFunction, Request, Response } from "express";
import createHttpError, { HttpError } from "http-errors";
import { config } from "./config/config";

const app = express();

app.get("/", (req, res, next) => {


    const error = createHttpError("Something went wrong");
    throw error;

    res.json({
        message: "Welcome to the Coders Gyan API!" });
});


//Globat Error declaration
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.status || 500;
    res.status(statusCode).json({
        message: err.message || "Internal Server Error",
        errorStack: config.env === 'development' ? err.stack : ""
    });
});

export default app;
