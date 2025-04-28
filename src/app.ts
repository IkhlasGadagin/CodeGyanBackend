import express from "express";

const app = express();

app.get("/", (req, res) => {
    res.json({
        message: "Welcome to the Coders Gyan API!"
    });
});

export default app;
