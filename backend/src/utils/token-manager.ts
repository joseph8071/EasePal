import jwt from "jsonwebtoken";
import { Response, Request, NextFunction } from "express";
import { COOKIE_NAME } from "./constants.js";

export const createToken = (id: string, email: string, expiresIn: string) => {
  const payload = { id, email };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn,
  });
  return token;
};


export const verifyToken = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const token = req.signedCookies[`${COOKIE_NAME}`];
    if (!token || token.trim() === "") {
        return res.status(401).json({ message: "Token not received" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.locals.jwtData = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Token is invalid or expired" });
    }
};
