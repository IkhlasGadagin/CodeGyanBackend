import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import Book from "./bookModel";



const createBook = async (req: Request, res: Response, next: NextFunction) => {
    const { title, author, description, price } = req.body;

    if (!title || !author || !description || !price) {
        const error = createHttpError(400, "All fields are required");
        return next(error);
    }

    try {
        const book = await Book.create({ title, author, description, price });
        res.status(201).json({
            message: "Book created successfully",
            book
        });
    } catch (error) {
        return next(createHttpError(500, "Error while creating book"))
    }
}

const getAllBooks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const books = await Book.find();
        res.json({
            message: "Books fetched successfully",
            books
        });
    } catch (error) {
        return next(createHttpError(500, "Error while fetching books"))
    }
}

const getBookById = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
        const book = await Book.findById(id);
        if (!book) {
            const error = createHttpError(404, "Book not found with this id");
            return next(error);
        }
        res.json({
            message: "Book fetched successfully",
            book
        });
    } catch (error) {
        return next(createHttpError(500, "Error while fetching book"))
    }
}

const updateBook = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    console.log(id, "id of the book");
    const { title, author, description, price } = req.body;

    try {
        const findBook = await Book.findById(id);
        if (!findBook) {
            const error = createHttpError(404, "Book not exist with this id");
            return next(error);
        }
    } catch (error) {
        return next(createHttpError(500, "Error while updating book"))
    }

    try {
        const book = await Book.findByIdAndUpdate(id, { title, author, description, price }, { new: true });
        if (!book) {
            const error = createHttpError(404, "Book not found with this id");
            return next(error);
        }
        res.json({
            message: "Book updated successfully",
            book
        });
    } catch (error) {
        return next(createHttpError(500, "Error while updating book"))
    }
}

const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
        const book = await Book.findByIdAndDelete(id);
        if (!book) {
            const error = createHttpError(404, "Book not found with this id");
            return next(error);
        }
        res.json({
            message: "Book deleted successfully",
            book
        });
    } catch (error) {
        return next(createHttpError(500, "Error while deleting book"))
    }
}

export { createBook, getAllBooks, getBookById, updateBook, deleteBook };
