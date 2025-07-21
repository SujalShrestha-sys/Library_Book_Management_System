import User from "../models/User.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const userLogin = async (req, res) => {

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required."
            })
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials."
            })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(401).json({
                status: false,
                message: "Invalid email or password",
            });
        }

        //jwt part
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_KEY, { expiresIn: "1h" });

        res.cookie("token", token, {
            httpOnly: true,
            expires: new Date(Date.now() + 36000000),
            secure: process.env.NODE_ENV === "production"
        })

        return res.status(200).json({
            success: true,
            message: "login Successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Login Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "login failed"
        })
    }
}

export const registerUser = async (req, res) => {
    try {
        console.log("Register Request Body:", req.body);
        const { name, email, password, role } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({ success: false, message: "All fields are required." });
        }

        const existingUser = await User.findOne({ email });
        console.log(existingUser);

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already exists."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: role === "librarian" ? "librarian" : "borrower",
        });

        const savedNewUser = await newUser.save();

        return res.status(201).json({
            success: true,
            message: "User registered successfully."
        });

    } catch (error) {
        console.log("Registration Error: ", error.message);
        res.status(500).json({
            success: false,
            message: "Registration Failed"
        })
    }

}