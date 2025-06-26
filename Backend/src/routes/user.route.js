import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { accpetFriendRequest, getFriendRequest, getMyFriends, getOutgoingFriendReqs, getRecommendedUsers, sendFriendRequest } from "../controllers/user.controller.js";

const router = express.Router();

router.use(protectRoute)

router.get("/", getRecommendedUsers);


router.get("/friends", getMyFriends);

router.post("/friend-request/:id", sendFriendRequest);

router.put("?friend-request/:id/accept", accpetFriendRequest);

router.get("/friend-requests", getFriendRequest);

router.get("/outgoing-friend-requests", getOutgoingFriendReqs);

export default router;