import express from "express";
import { createBook, getAllBooks, getBookById, updateBook, deleteBook } from "./bookController";

const bookRouter = express.Router();


bookRouter.post("/create", createBook);
bookRouter.get("/getallbooks", getAllBooks);
bookRouter.get("/:id", getBookById);
bookRouter.put("/:id", updateBook);
bookRouter.delete("/:id", deleteBook);

export default bookRouter;
