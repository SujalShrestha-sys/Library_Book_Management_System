import Book from "../models/Book.js";

export const createBook = async (req, res) => {
    try {
        const { title, author, isbn, quantity } = req.body;

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

        const newBookCreation = new Book({
            title,
            author,
            isbn,
            quantity,
            available: quantity,
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
        const { title, author, isbn, quantity, available } = req.body;

        const updatedBooks = await Book.findByIdAndUpdate(
            id,
            { title, author, isbn, quantity, available },
            {
                new: true
            }
        )

        if (!updatedBooks) {
            return res.status(404).json({
                success: false,
                message: "Book not found"
            });
        }

        return res.json({
            success: true,
            message: "Books updated successfully",
            updatedBooks: updatedBooks
        })

    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            success: false,
            message: "Failed to update book"
        });
    }
}

export const deleteBook = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Book.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Book not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Book deleted successfully",
            deletedBook: deleted,
        });

    } catch (error) {
        console.log("failed to delete books", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to delete book"
        });
    }
}

