import Ably from "ably";
import Message from "../models/messageModel.js";
import Conversation from "../models/conversationModel.js";

const ably = new Ably.Realtime("RiBQGw.vcnBXw:I1tNRwt-47uXrwOcHbs-koOfWDUub9whWEcWWBsPk7A");

export const getRecipientSocketId = (recipientId) => {
	return userSocketMap[recipientId];
};

const userSocketMap = {}; // userId: socketId

const channel = ably.channels.get("channel1");

console.log(channel)

channel.subscribe("markMessagesAsSeen", async ({ conversationId, userId }) => {
	try {
		await Message.updateMany(
			{ conversationId: conversationId, seen: false },
			{ $set: { seen: true } }
		);
		await Conversation.updateOne(
			{ _id: conversationId },
			{ $set: { "lastMessage.seen": true } }
		);
		if (userSocketMap[userId]) {
			// Check if user is online
			// Emit event to specific user using their Socket.IO socketId or Ably channel
			channel.publish(userSocketMap[userId], "messagesSeen", { conversationId });
		}
	} catch (error) {
		console.log(error);
	}
});

export { ably };
