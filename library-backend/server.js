import express from "express"
import dotenv from "dotenv"
import connectDatabase from "./config/database.js"
import authRoutes from "../library-backend/routes/authRoutes.js"
import cors from "cors"
import bookRoutes from "../library-backend/routes/bookRoutes.js"
import cookieParser from "cookie-parser";
import borrowRoutes from "./routes/borrowRoutes.js"

dotenv.config();
connectDatabase();

const app = express();

//middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());

//Routes
app.use("/api/auth", authRoutes)
app.use("/api/books",bookRoutes)
app.use("/api", borrowRoutes)

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});


const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server started at: http://localhost:${PORT}`)
})