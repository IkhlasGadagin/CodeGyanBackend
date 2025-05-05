import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import Book from "./bookModel";
import cloudinary from "../config/cloudinary";
import path from "node:path";



const createBook = async (req: Request, res: Response, next: NextFunction) => {
    console.log("files uploaded", req.files)
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const coverImageMimeType = files?.coverImage[0].mimetype.split("/").at(-1);

    //taking the image and saving it in the public folder
    const fileName = files?.coverImage[0].filename;
    const filePath = path.resolve(__dirname, '../../public/data/uploads',fileName);

    // const { title, description, price } = req.body;
    //uploading the image to cloudinary
   try {
     const uploadResult = await cloudinary.uploader.upload(filePath, {
         filename_override: fileName,
         folder: "book-covers",
         format: coverImageMimeType,
     })
   } catch (error) {
    console.log(error, "error in uploading the image to cloudinary");
    return next(createHttpError(500, "Error in uploading the image to cloudinary"));
   }

    // taking the pdf and saving it in the public folder
    const bookFileName = files?.file[0].filename;
    const bookFilePath = path.resolve(__dirname, '../../public/data/uploads',bookFileName);
    // const bookFileMimeType = files?.book[0].mimetype.split("/").at(-1);

    //uploading the pdf to cloudinary
    const bookFileUpload = await cloudinary.uploader.upload(bookFilePath,{
        resource_type: "raw",
        filename_override: bookFileName,
        folder: "book-pdf",
        format: "pdf",
    })
console.log(bookFileUpload, "bookFileUpload");
res.json({});


    
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
