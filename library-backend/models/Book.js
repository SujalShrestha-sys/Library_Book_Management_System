import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        trim: true,
    },
    author: {
        type: String,
        required: true,
        trim: true,
    },
    isbn: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    available: {
        type: Number,
        required: true,
        min: 0,
    },
    genre: {
        type: String,
        required: true,
        trim: true,
    },
    publisher: {
        type: String,
        required: true,
        trim: true,
    },
    publishedYear: {
        type: Number,
        required: true,
        min: 0,
    },
    description: {
        type: String,
        required: false,
        trim: true,
    },
    coverImage: {
        type: String,
        trim: true,
        default: "", //optional: blank if no image is uploaded
    }
},
    { timestamps: true }
)

const Book = mongoose.model("Book", bookSchema);

export default Book;