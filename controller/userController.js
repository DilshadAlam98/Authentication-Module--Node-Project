import User from "../models/user.js";
import { isAccessTokenValid, isValidPassword, hashPassword, generateAccessToken, generateRefreshToken, protect } from "../middleware/user_middleware.js"

import { databaseClient } from "../config/db.js";


/// CREATE NEW USER--------------------------
const createUser = async (req, res) => {
    const { first_name, last_name, email, gender, mobile, password } = req.body;
    await databaseClient.connect();
    if (!first_name || !last_name || !email || !gender || !mobile || !password) {
        throw new Error("All fields are required");
    }

    try {
        const user = await databaseClient.query('SELECT * FROM "user" WHERE email = $1', [email]);
        console.log(`user----${user}`);
        if (user.rowCount === 0) {
            const hashed = await hashPassword(password);
            await databaseClient.query('INSERT INTO "user" (first_name, last_name, email, gender, mobile, password) VALUES ($1, $2, $3, $4, $5, $6)', [first_name, last_name, email, gender, mobile, hashed]);
            res.status(200).json({ message: "User added successfully" });
        } else {
            res.status(201).json({ message: "User already exists" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    } finally {
        // databaseClient.end(); // Close the database connection

    }

}


const loginUser = async (req, res) => {
    const { email, password } = req.body;
    await databaseClient.connect();
    try {
        const user = await databaseClient.query('SELECT * FROM "user" WHERE email = $1', [email]);

        if (user.rowCount === 0) {
            return res.status(401).json({ message: "User doesn't exist" });
        }

        const hashPassword = user.rows[0].password;
        const userId = user.rows[0].id;
        const passwordMatch = await isValidPassword(password, hashPassword);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Password does not match" });
        }

        const accessToken = await generateAccessToken(email, hashPassword, userId);
        const refreshToken = await generateRefreshToken(email, hashPassword, userId);
        return res.status(200).json({
            message: "Success", data: {
                userId,
                accessToken,
                refreshToken,
            }
        });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    } finally {
        // databaseClient.end();
    }
};

/// DELETE USER-------------------------------

const deleteUser = async (req, res) => {
    console.log(req.params);
    const userId = req.params.id;
    await databaseClient.connect();
    try {
        const user = await databaseClient.query('DELETE FROM "user" WHERE id=$1', [userId]);
        if (user.rowCount === 0) {
            return res.status(400).json({ message: "User does not exist" });
        }
        return res.status(200).json({
            message: "Success", data: `User delete with id ${userId}`
        });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    } finally {
        // databaseClient.end();
    }
};

/// GET USER-------------------

const getUser = async (req, res) => {
    await databaseClient.connect();
    try {
        const user = await databaseClient.query('SELECT * FROM "user"');
        if (user.rows.length > 0) {
            const usersWithoutPasswords = user.rows.map(user => {
                const { password, ...userWithoutPassword } = user;
                return userWithoutPassword;
            });
            return res.status(200).json({ message: "Success", data: usersWithoutPasswords })
        }
    } catch (err) {
        res.status(500).send({ message: err.message })
        console.log(err);
    }
}

/// Update user------

const updateUser = async (req, res) => {
    const { first_name, last_name, email, gender, mobile, id } = req.body;
    if (!id) {
        return res.status(400).json({ message: "User id is required" });
    }

    try {
        await databaseClient.connect();
        const updateQuery = `
            UPDATE "user"
            SET first_name = $1, last_name = $2, email = $3, mobile = $4, gender = $5
            WHERE id = ${id}
            RETURNING *
        `;
        const user = await databaseClient.query(updateQuery, [first_name, last_name, email, mobile, gender]);

        if (user.rowCount === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ message: "User updated successfully", data: user.rows[0] });
    } catch (error) {
        return res.status(500).json({ message: "Error updating user", error: error.message });
    } finally {
        // await databaseClient.end();
    }
};

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
    res.status(200).send({ status: 200, message: "Success", newAccessToken, newRefreshToken });
}



/// FORGET PASSWORTD----------------------------------

const forgetPassword = async (req, res) => {
    const { oldPassword, newPassword, id } = req.body;
    await databaseClient.connect();
    try {
        if (oldPassword === newPassword) {
            return res.status(201).json({ message: "Old Password and New Password can not be same" })
        }
        const user = await databaseClient.query('SELECT * FROM "user" WHERE id=$1', [id]);
        if (user.rowCount === 0) {
            return res.status(401).json({ message: "User doesn't exist" });
        }
        const savedPassword = user.rows[0].password;
        const userId = user.rows[0].id;
        const passwordMatch = await isValidPassword(oldPassword, savedPassword);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Old Password does not match in our records" });
        }
        const decryptedPassword = await hashPassword(newPassword);
        await databaseClient.query('UPDATE "user" SET password = $1 WHERE id = $2', [decryptedPassword, userId]);
        res.status(200).send("Password Updated Successfully");
    } catch (e) {
        console.log(e);
        res.status(500).send({ message: err.message })
    }

}

export { createUser, getUser, loginUser, deleteUser, createNewAccessToken, forgetPassword, updateUser }