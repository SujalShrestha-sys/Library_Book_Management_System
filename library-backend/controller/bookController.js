import Book from "../models/Book.js";

export const createBook = async (req, res) => {
    try {
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

        // check required fields
        if (!title || !author || !isbn || !quantity) {
            return res.status(400).json({
                success: false,
                message: "Title, Author, ISBN, and Quantity are required",
            });
        }

        // check if ISBN already exists
        const existingBook = await Book.findOne({ isbn });
        if (existingBook) {
            return res.status(409).json({
                success: false,
                message: "ISBN already exists in the database",
            });
        }

        // handle image (if uploaded)
        const coverImage = req.file ? req.file.path : "";

        const newBook = new Book();
        newBook.title = title;
        newBook.author = author;
        newBook.isbn = isbn;
        newBook.quantity = quantity;
        newBook.available = available ? available : quantity; // if not given, available = quantity
        newBook.genre = genre;
        newBook.publisher = publisher;
        newBook.publishedYear = publishedYear;
        newBook.description = description;
        newBook.coverImage = coverImage;

        const savedBook = await newBook.save();

        res.status(200).json({
            success: true,
            message: "Book created successfully",
            book: savedBook,
        });
    } catch (error) {
        console.error("Create error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create book",
        });
    }
};

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
        console.log("===== Update Book Request =====");
        console.log("Book ID:", req.params.id);
        console.log("Request body:", req.body);
        console.log("Uploaded file:", req.file)
        const { id } = req.params;

        // find existing book
        const existingBook = await Book.findById(id);
        if (!existingBook) {
            return res.status(404).json({ success: false, message: "Book not found" });
        }

        // if new image uploaded, use it, else keep old
        const coverImage = req.file ? req.file.path : existingBook.coverImage;

        // update fields one by one
        existingBook.title = req.body.title || existingBook.title;
        existingBook.author = req.body.author || existingBook.author;
        existingBook.isbn = req.body.isbn || existingBook.isbn;
        existingBook.quantity = req.body.quantity || existingBook.quantity;
        existingBook.available = req.body.available || existingBook.available;
        existingBook.genre = req.body.genre || existingBook.genre;
        existingBook.publisher = req.body.publisher || existingBook.publisher;
        existingBook.publishedYear = req.body.publishedYear || existingBook.publishedYear;
        existingBook.description = req.body.description || existingBook.description;
        existingBook.coverImage = coverImage;

        const updatedBook = await existingBook.save();

        res.status(200).json({
            success: true,
            message: "Book updated successfully",
            updatedBook,
        });
    } catch (error) {
        console.error("Update error:", error);
        res.status(500).json({ success: false, message: "Failed to update book" });
    }
};

export const deleteBook = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedBook = await Book.findByIdAndDelete(id);

        if (!deletedBook) {
            return res.status(404).json({ success: false, message: "Book not found" });
        }

        res.status(200).json({
            success: true,
            message: "Book deleted successfully",
        });
    } catch (error) {
        console.error("Delete error:", error);
        res.status(500).json({ success: false, message: "Failed to delete book" });
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
        const books = await Book.aggregate([{ $sample: { size: 6 } }]);

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

