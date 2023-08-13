import jwt from "jsonwebtoken"
import { hash, compare } from "bcrypt"
import { databaseClient } from "../config/db.js";
import asyncHandler from 'express-async-handler'

const { SECRET_KEY, ACCESS_TOKEN_EXPIRATION, REFRESH_TOKEN_EXPIRATION } = process.env;



const isAccessTokenValid = async (token) => {
    try {
        const decodedToken = await jwt.verify(token, process.env.SECRET_KEY);
        return decodedToken;
    } catch (err) {
        console.log("ERROR DECODING TOKEN");
        console.log(err);
        return;
    }
}

const isValidPassword = (oldPassword, newPassword) => {
    console.log(`Old Password---${oldPassword}`);
    console.log(`New Password---${newPassword}`);
    try {
        return compare(oldPassword, newPassword)
    } catch (err) {
        throw Error("Invalid Password")
    }

}

const hashPassword = async (password) => {
    return await hash(password, 10);
}

const generateAccessToken = async (email, password, userId) => {
    console.log(email);
    console.log(password);
    console.log(SECRET_KEY);
    console.log(ACCESS_TOKEN_EXPIRATION);
    const accessToken = jwt.sign({ email, password, userId }, process.env.SECRET_KEY, { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION });
    return accessToken;
};

const generateRefreshToken = async (email, password, userId) => {
    const refreshToken = jwt.sign({ email, password, userId }, process.env.SECRET_KEY, { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION });
    return refreshToken;
};


const protect = asyncHandler(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            await databaseClient.connect();
            const user = await databaseClient.query('SELECT * FROM "user" WHERE id=$1', [decoded.userId]);
            if (user.rowCount === 0) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            next();
        } catch (error) {
            if (error.message === "jwt expired") {
                return res.status(400).json({ message: "Session Expired" });
            } else {
                return res.status(500).json({ message: error.message });
            }
        }
    } else {
        return res.status(401).json({ message: "Unauthorized" });
    }
});




export { isAccessTokenValid, isValidPassword, hashPassword, generateAccessToken, generateRefreshToken, protect }