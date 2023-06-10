import jwt from "jsonwebtoken"
import { hash, compare } from "bcrypt"

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
    console.log(userId);
    console.log(SECRET_KEY);
    console.log(ACCESS_TOKEN_EXPIRATION);
    const accessToken = jwt.sign({ email, password, userId }, process.env.SECRET_KEY, { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION });
    return accessToken;
};

const generateRefreshToken = async (email, password, userId) => {
    const refreshToken = jwt.sign({ email, password, userId }, process.env.SECRET_KEY, { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION });
    return refreshToken;
};

export { isAccessTokenValid, isValidPassword, hashPassword, generateAccessToken, generateRefreshToken }