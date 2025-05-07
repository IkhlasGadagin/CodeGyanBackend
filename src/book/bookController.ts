import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import Book from "./bookModel";
import cloudinary from "../config/cloudinary";
import path from "node:path";
import fs from "node:fs";
import { AuthRequest } from "../middlewares/authenticate";


const createBook = async (req: Request, res: Response, next: NextFunction) => {
//STEPS take file from multer take the file with the variable names (coverImage and file) name and save it in the public folder
//take the image and upload it to cloudinary
//take the pdf and upload it to cloudinary
//save the image and pdf url in the database
//delete the file from the public folder fs
const {title, description, price, genre}=req.body
console.log(title, description, price, genre, "the data from the body");

console.log(req.files, "the files from the request");

    // console.log("files uploaded", req.files)
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
     const bookFileName = files?.file[0].filename;
     const bookFilePath = path.resolve(__dirname, '../../public/data/uploads',bookFileName);

     

     const bookFileUpload = await cloudinary.uploader.upload(bookFilePath,{
        resource_type: "raw",
        filename_override: bookFileName,
        folder: "book-pdf",
        format: "pdf",
    })

    // console.log(uploadResult, "the result from the cloudinary image upload");
    // console.log(bookFileUpload, "the result from the cloudinary pdf upload");

   // saving the image and pdf url in the database
   const userId = (req as AuthRequest).userIdi;
   console.log(bookFileName,bookFilePath, userId, "From The middlewaare /////////////");
   
    const newBook = await Book.create({
        title,
        description,
        price,
        author:"68166adf5f31b8c90b83bf2c",
        coverImage: uploadResult.secure_url,
        file: bookFileUpload.secure_url,
        genre:genre,
    })

   try {
     await fs.promises.unlink(filePath);
     await fs.promises.unlink(bookFilePath);
   } catch (error) {
   return next(createHttpError(500, "Error in deleting the file from the public folder"))    
   }
    res.status(201).json({
        message: "Book created successfully",
        id : newBook._id
    });
   } catch (error) {
    console.log(error, "error in uploading the image to cloudinary");
    return next(createHttpError(500, "Error in uploading the image to cloudinary"));
   }

    // taking the pdf and saving it in the public folder
  
    // const bookFileMimeType = files?.book[0].mimetype.split("/").at(-1);

  
// console.log(bookFileUpload, "bookFileUpload");



    
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
