import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Token not provided"
            });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.user = decoded; // { id, role }

        next();
    } catch (error) {
        console.log(error.message);
        res.status(401).json({
            success: false,
            message: "Unauthorized, invalid token"
        });
    }
};


export const authorizedRole = (...roles) => {
    return (req, res, next) => {
        const userRole = req.user?.role;

        if (!roles.includes(userRole)) {
            return res.status(403).json({
                success: false,
                message: "Access denied."
            })
        }

        next();
    }
}