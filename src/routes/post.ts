import { Router } from "express";
import {
  addPost,
  deletePost,
  getPost,
  getPosts,
  updatePost,
} from "../controllers/post";
import { body, check, query } from "express-validator";
import { requestValidator } from "../middleware/request-validator";
import { uploader } from "../utils/uploader";
import { auth } from "../middleware/auth";

const route = Router();
const upload = uploader("post");

route.get("/", getPosts);
route.get("/:postId", auth, getPost);
route.post(
  "/",
  auth,
  upload.array("images", 5),
  [body("title", "Title is required!").notEmpty()],
  requestValidator,
  addPost
);
route.put(
  "/:postId",
  auth,
  [body("title", "Title is required!").notEmpty()],
  requestValidator,
  updatePost
);

route.delete("/:postId", auth, deletePost);

export { route as postRoute };
