import express from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler";
// import createHttpError from "http-errors";
const app = express();

app.get("/", (req, res, next) => {


    // const error = createHttpError("Something went wrong");
    // throw error;

    res.json({
        message: "Welcome to the Coders Gyan API!" });
});


//Globat Error declaration
app.use(globalErrorHandler);

export default app;
