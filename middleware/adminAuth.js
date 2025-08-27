import jwt from 'jsonwebtoken';

const adminAuth = async (req, res, next) => {
    try {
        const { token } = req.headers;

        if (!token) {
            return res.status(401).json({ success: false, message: "Not Authorized. Login again." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if decoded token has correct email (assuming email was encoded)
        if (decoded.email !== process.env.ADMIN_EMAIL) {
            return res.status(403).json({ success: false, message: "Forbidden: Not an admin." });
        }

        // If all good, proceed
        next();
    } catch (error) {
        console.error("Admin Auth Error:", error);
        res.status(401).json({ success: false, message: "Invalid or expired token." });
    }
};

export default adminAuth;
