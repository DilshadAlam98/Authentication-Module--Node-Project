import * as user from "../controller/userController.js"
import { Router } from "express"

const router = Router();


// register user route

router.post("/register", user.createUser);

// Login User Route;
router.post("/login", user.loginUser);

/// User profile Route
router.get("/get-user", user.getUser);

/// Delete User Route
router.delete("/delete/:id", user.deleteUser);

/// Get New Access Token
router.get("/access-token", user.createNewAccessToken);

/// Forget Password

router.post("/forget-password", user.forgetPassword);


export default router;