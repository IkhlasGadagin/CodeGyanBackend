import express from "express";
import { createBook, getAllBooks, getBookById, updateBook, deleteBook } from "./bookController";
import path from "node:path";
import multer from "multer";

const bookRouter = express.Router();

const upload = multer({ 
    dest:path.resolve(__dirname, '../../public/data/uploads'),
    limits: {fileSize: 3e7},
    // storage: multer.memoryStorage() 

});


bookRouter.post("/create", createBook);
bookRouter.get("/getallbooks", getAllBooks);
bookRouter.get("/:id", getBookById);
bookRouter.put("/:id", updateBook);
bookRouter.delete("/:id", deleteBook);

export default bookRouter;
