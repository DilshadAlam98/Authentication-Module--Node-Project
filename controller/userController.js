import User from "../models/user.js";
import { v4 as uuidv4 } from "uuid";
import { isAccessTokenValid, isValidPassword, hashPassword, generateAccessToken, generateRefreshToken } from "../middleware/user_middleware.js"


/// CREATE NEW USER--------------------------
const createUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            throw new Error(" this field are required");
        }
        const existingUser = await User.findOne({ $or: [{ username }, { email }] })
        if (existingUser) {
            throw new Error("User already exist");
        } else {

            const userId = uuidv4();
            const newUser = User({
                userId,
                username, email, password: await hashPassword(password)
            });
            await newUser.save();
            res.status(200).send({ status: true, message: "Account created successfully", });
        }
    } catch (err) {
        res.status(500).send({ message: err.message })
        console.log(err);
    }
}


/// LOGIN USER------------------------------------
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            const isPasswordValid = await isValidPassword(password, user.password)
            if (isPasswordValid) {
                const userId = user.userId;
                const accessToken = await generateAccessToken(email, password, userId);
                const refreshToken = await generateRefreshToken(email, password, userId);
                res.status(200).send({ message: "Success", accessToken, refreshToken });
            } else {
                res.status(401).send({ message: "Password is incorrect" });
            }
        } else {
            res.status(404).send({ message: "User not found" });
        }
    } catch (err) {
        res.status(500).send({ message: err.message });
        console.log(err);
    }
};



/// DELETE USER-------------------------------

const deleteUser = async (req, res) => {
    console.log(req.params);
    const userId = req.params.id;
    try {
        const deletedUser = await User.findOneAndDelete({ userId });
        if (deletedUser) {
            res.status(200).send({ message: "User deleted successfully", deleteUser });
        } else {
            res.status(404).send({ message: "User not found" });
        }
    } catch (err) {
        res.status(500).send({ message: err.message });
        console.log(err);

    }

}


/// GET USER-------------------

const getUser = async (req, res) => {
    try {
        const token = req.headers.authorization || req.query.token;
        if (token == null) {
            throw Error("You are not authorized to access")
        }
        const decoadedToken = await isAccessTokenValid(token)
        if (decoadedToken) {
            console.log("Inside IF");
            const userId = decoadedToken.userId;
            console.log(userId);
            const user = await User.findOne({ userId });
            if (user) {
                console.log("User");
                const { _id, __v, password, ...userData } = user.toObject()
                res.status(200).send({ status: true, message: "Success", userData })
            } else {
                res.status(404).send({ status: false, message: "User Doesnot Exist" })
            }
        } else {
            res.status(401).send({ message: "Invalid Access Token" })
        }



    } catch (err) {
        res.status(500).send({ message: err.message })
        console.log(err);
    }
}


/// GET NEW ACCESS TOKEN -------------------------------------

const createNewAccessToken = async (req, res) => {
    const { refreshToken } = req.body;
    if (refreshToken == null) throw Error("Invalid refresh token");

    const decodedRefreshToken = await isAccessTokenValid(refreshToken);

    const userId = decodedRefreshToken.userId;
    const email = decodedRefreshToken.email;
    const password = decodedRefreshToken.password;
    const newAccessToken = await generateAccessToken(email, password, userId);
    const newRefreshToken = await generateRefreshToken(email, password, userId);
    res.status(200).send({ message: true, newAccessToken, newRefreshToken });
}



/// FORGET PASSWORTD----------------------------------

const forgetPassword = async (req, res) => {
    const { oldPassword, newPassword, userId } = req.body;
    try {
        const user = await User.findOne({ userId });
        if (user) {
            console.log("Save Passwrod");
            console.log(user.password);
            const isPasswordMatch = await isValidPassword(oldPassword, user.password)
            if (!isPasswordMatch) throw Error("Old Password not match")
            const decryptedPassword = await hashPassword(newPassword);
            user.password = decryptedPassword;
            await user.save()
            res.status(200).send("Password Updated Successfully");
        } else {
            res.send({ message: "User not found" })
        }
    } catch (e) {
        console.log(e);
        res.status(500).send({ message: err.message })
    }

}

export { createUser, getUser, loginUser, deleteUser, createNewAccessToken, forgetPassword }