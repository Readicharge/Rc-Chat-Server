import express from "express";
import protectRoute from "../middlewares/protectRoute.js";
import { getMessages, sendMessage, getConversations,connectWithAdmin } from "../controllers/messageController.js";

const router = express.Router();

router.get("/conversations", protectRoute, getConversations);
router.get("/:otherUserId", protectRoute, getMessages);
router.get("/connectWithAdmin",protectRoute,connectWithAdmin)
router.post("/", protectRoute, sendMessage);

export default router;
