import FriendRequest from "../models/friendRequest.js";
import User from "../models/User.js";

 export async function getRecommendedUsers(req, res) {
    
    try {
        const currentUserId = req.user.id;

        const currentUser = req.user;

        const recommendedUsers = await User.find({
            $and: [
                {_id: {$ne: currentUserId}},
                {$id: {$nin: currentUser.friends}},
                {isonboarded: true} 
            ]
        })
        res.status(200).json(recommendedUsers);
    } catch (error) {
        console.error("Error in getRecommendedUsers controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
 }

 export async function getMyFriends(req, res) {
    try {
        const user = await User.findById(req.user.id)
        .select("friends")
        .populate("friends", "fullName profilePic nativeLanguage learingLearing");

        res.status(200).json(user.friends);
    } catch (error) {
        console.error("Error in getMyFriends controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
 }

 export async function sendFriendRequest(req, res) {

    try {

        const myId = req.user.id;
        const { id:recipientId } = req.params

        if(myId === recipientId) {
            return res.status(400).json({ message: "You can't send friend request to ypurself" });
        }

        const recipient = await User.findById(recipientId)

        if(!recipient) {
            return res.status(404).json({ message: "User not found" });
        }

        if(recipient.friends.includes(myId)) {
            return res.status(400).json({ message: "You are already friends with this user" });
        }

        const existingRequest = await FriendRequest.findOne({
            $or: [
                { sender:myId, recipient: recipientId},
                { sender: recipientId, recipient: myId},
            ],
        });

        if (existingRequest) {
            return res 
            .status(400)
            .json({ message: "A friend request already exists between you and this user" });
        }

        const friendRequest = await FriendRequest.create({
            sender: myId,
            recipient: recipientId,
        });

        res.status(201).json(friendRequest)
    } catch (error) {
        console.error("Error in sendFriendRequest controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
 }