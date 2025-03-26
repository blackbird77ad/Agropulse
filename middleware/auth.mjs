import jwt from "jsonwebtoken";


// Middleware: Verify JWT token (Check if user is logged in)
export const verifyToken = (req, res, next) => {
    try {
        const token = req.header("Authorization")?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "No token provided, please log in." });
        }

        if (blacklistedTokens.has(token)) {
            return res.status(401).json({ message: "Session expired, please log in again." });
        }

        const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
        // console.log("Decoded Token:", decoded);  // token payload

        req.auth = decoded; // Attach user data to request

        next();
    } catch (error) {
        // console.log("JWT Error:", error.message); // Log any JWT errors
        return res.status(401).json({ message: "Invalid token, please log in again." });
    }
};