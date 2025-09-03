import express from "express"
import dotenv from "dotenv"
import connectDatabase from "./config/database.js"
import authRoutes from "../library-backend/routes/authRoutes.js"
import cors from "cors"
import bookRoutes from "../library-backend/routes/bookRoutes.js"
import cookieParser from "cookie-parser";
import borrowRoutes from "./routes/borrowRoutes.js"
import adminRoutes from "../library-backend/routes/adminRoutes.js"
import borrowerRoutes from "./routes/borrowerRoutes.js"
import contactRoutes from "./routes/contactRoutes.js"

dotenv.config();
connectDatabase();

const app = express();

const allowedOrigins = [
  "https://library-book-management-system.vercel.app",
  "http://localhost:5173"
]

//middlewares 
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use("/uploads", express.static("uploads"));

//Routes
app.use("/api/auth", authRoutes)
app.use("/api/books", bookRoutes)
app.use("/api", borrowRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/borrower", borrowerRoutes)
app.use("/api/contact", contactRoutes)


app.use("/", (req, res) => {
  res.send("Welcome to LBMS- done and deployed by @Sujal Shrestha")
});


const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server started at: http://localhost:${PORT}`)
})