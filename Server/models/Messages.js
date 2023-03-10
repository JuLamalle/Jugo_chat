import mongoose from 'mongoose';
const { Schema } = mongoose;

const messagesSchema = new Schema({
    messageId: String,
    message: String,
    roomId: String,
    userId: String,
    nickname: String,
});

export default mongoose.model("Message", messagesSchema); 