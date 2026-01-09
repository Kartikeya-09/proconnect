import { Router } from "express";
// import { activeCheck } from "../controllers/post.controller.js";
import multer from 'multer';    
import { commentOnPost, createPost ,  deleteCommentPost,  deletePost,  getAllPosts, getCommentsByPost, likePost} from "../controllers/post.controller.js";
const router = Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // specify the destination directory
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // specify the file name
    }
});     
const upload = multer({ storage: storage });

// router.route("/").get(activeCheck);
router.route("/post").post(upload.single('media'),createPost);
router.route("/posts").get(getAllPosts);
router.route("/delete_post").delete(deletePost);
router.route("/comment").post(commentOnPost);
router.route("/get_comments").post(getCommentsByPost);
router.route("/delete_comment").delete(deleteCommentPost);
router.route("/like_post").post(likePost);
export default router;