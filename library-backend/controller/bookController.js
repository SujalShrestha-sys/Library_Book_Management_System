import Book from "../models/Book.js";
import { v2 as cloudinary } from "cloudinary";

export const createBook = async (req, res) => {
    try {
        const { title, author, isbn, quantity, available, genre, publisher, publishedYear, description } = req.body;

        if (!title || !author || !isbn || !quantity) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const existingBook = await Book.findOne({ isbn })

        if (existingBook) {
            return res.status(409).json({
                success: false,
                message: "ISBN already exists in the database"
            })
        }

        const coverImage = req.file ? req.file.path : "";
        console.log(coverImage)

        const newBookCreation = new Book({
            title,
            author,
            isbn,
            quantity,
            available,
            publishedYear,
            genre,
            publisher,
            description,
            coverImage
        });

        const savedBook = await newBookCreation.save();

        res.status(200).json({
            success: true,
            message: "Book created successfully",
            book: savedBook,
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to create book"
        })
    }

}

export const getAllBooks = async (req, res) => {
    try {
        const allBooks = await Book.find();

        if (allBooks) {
            res.status(200).json({
                success: true,
                message: "fetched all books",
                allBooks
            });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch book"
        })
    }
}

export const updateBooks = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            title,
            author,
            isbn,
            quantity,
            available,
            genre,
            publisher,
            publishedYear,
            description,
        } = req.body;

        // Convert quantity and available to numbers safely
        const quantityNum = quantity ? Number(quantity) : 0;
        const availableCopies = available ? Number(available) : quantityNum;

        const existingBook = await Book.findById(id);
        if (!existingBook) {
            return res.status(404).json({
                success: false,
                message: "Book not found",
            });
        }

        // Handle cover image upload
        let coverImage = existingBook.coverImage;
        if (req.file) {
            // Delete old image from Cloudinary if it exists
            if (existingBook.coverImage) {
                try {
                    const publicId = existingBook.coverImage
                        .split("/")
                        .slice(-2)
                        .join("/") // get folder/name
                        .split(".")[0]; // remove extension

                    await cloudinary.uploader.destroy(publicId);
                    console.log("Old cover image deleted:", publicId);
                } catch (err) {
                    console.error("Failed to delete old cover image:", err);
                }
            }

            // Assign new uploaded Cloudinary image
            coverImage = req.file.path;
        }

        const updateData = {
            title,
            author,
            isbn,
            quantity: quantityNum,
            available: availableCopies,
            genre,
            publishedYear,
            publisher,
            description,
            coverImage,
        };

        const updatedBook = await Book.findByIdAndUpdate(id, updateData, {
            new: true,
        });

        return res.status(200).json({
            success: true,
            message: "Book updated successfully",
            updatedBook,
        });
    } catch (error) {
        console.error("Failed to update book:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update book",
        });
    }
};


export const deleteBook = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Book.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Book not found",
            });
        }

        // If book had a cover image, delete it from Cloudinary
        if (deleted.coverImage) {
            try {
                const urlParts = deleted.coverImage.split("/");
                const fileName = urlParts[urlParts.length - 1];
                const publicId = `library-books/${fileName.split(".")[0]}`; // remove extension

                await cloudinary.uploader.destroy(publicId);
                console.log("Cover image deleted from Cloudinary:", publicId);
            } catch (err) {
                console.error("Failed to delete cover image from Cloudinary:", err);
            }
        }

        return res.status(200).json({
            success: true,
            message: "Book deleted successfully",
            deletedBook: deleted,
        });
    } catch (error) {
        console.log("Failed to delete book:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to delete book",
        });
    }
};


export const getNewRelease = async (req, res) => {
    try {
        const books = await Book.find().sort({ createdAt: -1 }).limit(5);
        res.status(200).json({
            success: true,
            data: books
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching new releases"
        })
    }

}

export const getRecommendedBooks = async (req, res) => {
    try {
        const books = await Book.aggregate([{ $sample: { size: 5 } }]);

        res.status(200).json({
            success: true,
            data: books
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching recommended books"
        })
    }
}

