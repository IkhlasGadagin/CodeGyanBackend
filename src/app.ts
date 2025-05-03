import express from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import userRouter from "./user/useRouter";
// import createHttpError from "http-errors";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res, next) => {


    // const error = createHttpError("Something went wrong");
    // throw error;

    res.json({
        message: "Welcome to the Coders Gyan API!" });
});

app.use("/api/v1/users", userRouter);


//Globat Error declaration
app.use(globalErrorHandler);

export default app;
