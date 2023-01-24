import mongoose from 'mongoose';
const { Schema } = mongoose;

const roomsSchema = new Schema({
    roomId: String,
    name: String,
});

export default mongoose.model("Room", roomsSchema); 