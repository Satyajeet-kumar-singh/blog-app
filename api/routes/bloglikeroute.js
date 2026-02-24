import express from "express"
import { doLike, getLike } from "../controllers/bloglikecontroller.js"
import { authenticate } from "../middleware/authenticate.js"

const blogLikeRoute = express.Router()

blogLikeRoute.post("/do-like",authenticate,doLike)
blogLikeRoute.get("/get-like/:blogid/:userid",getLike)


export default blogLikeRoute