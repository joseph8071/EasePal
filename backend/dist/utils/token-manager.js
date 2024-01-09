import jwt from "jsonwebtoken";
import { COOKIE_NAME } from "./constants.js";
export const createToken = (id, email, expiresIn) => {
    const payload = { id, email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn,
    });
    return token;
};
export const verifyToken = async (req, res, next) => {
    const token = req.signedCookies[`${COOKIE_NAME}`];
    if (!token || token.trim() === "") {
        return res.status(401).json({ message: "Token not received" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.locals.jwtData = decoded;
        next();
    }
    catch (err) {
        return res.status(401).json({ message: "Token is invalid or expired" });
    }
};
//# sourceMappingURL=token-manager.js.map