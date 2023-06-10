import * as userPost from "../controller/user_post_controller.js"
import { Router } from "express"

const router = Router();

router.post("/add-posts", userPost.addPosts);

export default router;