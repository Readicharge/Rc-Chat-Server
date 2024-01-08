import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js";
import User from "../models/userModel.js";
import { ably } from "../socket/socket.js";
import { v2 as cloudinary } from "cloudinary";

async function sendMessage(req, res) {
	try {
		const { recipientId, message } = req.body;
		let { img } = req.body;
		const senderId = req.user._id;

		let conversation = await Conversation.findOne({
			participants: { $all: [senderId, recipientId] },
		});

		if (!conversation) {
			conversation = new Conversation({
				participants: [senderId, recipientId],
				lastMessage: {
					text: message,
					sender: senderId,
				},
			});
			await conversation.save();
		}

		if (img) {
			const uploadedResponse = await cloudinary.uploader.upload(img);
			img = uploadedResponse.secure_url;
		}

		const newMessage = new Message({
			conversationId: conversation._id,
			sender: senderId,
			text: message,
			img: img || "",
		});

		await Promise.all([
			newMessage.save(),
			conversation.updateOne({
				lastMessage: {
					text: message,
					sender: senderId,
				},
			}),
		]);

		// Publish an event to the 'markMessagesAsSeen' Ably channel
		const channel = ably.channels.get("general");
		channel.publish("markMessagesAsSeen", { conversationId: conversation._id, userId: senderId });

		res.status(201).json(newMessage);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
}

async function getMessages(req, res) {
	const { otherUserId } = req.params;
	const userId = req.user._id;
	try {
		const conversation = await Conversation.findOne({
			participants: { $all: [userId, otherUserId] },
		});

		if (!conversation) {
			return res.status(404).json({ error: "Conversation not found" });
		}

		const messages = await Message.find({
			conversationId: conversation._id,
		}).sort({ createdAt: 1 });

		res.status(200).json(messages);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
}



async function connectWithAdmin(req, res) {
	try {
		const { userId, adminId } = req.body;
		console.log(userId, adminId);
		var adminIdNew = "";
		if (adminId === undefined || adminId=== null) {
			// We will assign one Admin to the User 
			const suitableAdmin = await User.find({ user_type: "user" });
			// Here we will get the list of users, out of which we have to select one
			// But for now We are not focusing on the algorithm behind this as we have not discussed this part yet with Brian 

			adminIdNew = suitableAdmin[0]._id;
			res.status(201).json({adminId:adminIdNew});
		}
		else
		{
			
			const conversation = await Conversation.findOne({
				participants: { $all: [userId, adminId] },
			});
	
			if (!conversation) {
				return res.status(404).json({ error: "Conversation not found" });
			}
	
			const messages = await Message.find({
				conversationId: conversation._id,
			}).sort({ createdAt: 1 });
	
			res.status(200).json(messages);
		}

		
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
}

async function getConversations(req, res) {
	const userId = req.user._id;
	try {
		const conversations = await Conversation.find({ participants: userId }).populate({
			path: "participants",
			select: "username profilePic",
		});

		// remove the current user from the participants array
		conversations.forEach((conversation) => {
			conversation.participants = conversation.participants.filter(
				(participant) => participant._id.toString() !== userId.toString()
			);
		});
		res.status(200).json(conversations);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
}

export { sendMessage, getMessages, getConversations, connectWithAdmin };
