import * as user from "../controller/userController.js"
import { Router } from "express"
import { protect } from "../middleware/user_middleware.js";

const router = Router();


// register user route

router.post("/register", user.createUser);

// Login User Route;
router.post("/login", user.loginUser);

/// User profile Route
router.get("/get-user", protect, user.getUser);

/// Delete User Route
router.delete("/delete/:id", user.deleteUser);

/// Update User Route....
router.put("/update-user", protect, user.updateUser);

/// Get New Access Token
router.get("/access-token", user.createNewAccessToken);

/// Forget Password

router.post("/forget-password", protect, user.forgetPassword);


export default router;