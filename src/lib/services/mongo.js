// @ts-nocheck
import 'dotenv/config';
import mongoose from 'mongoose';

mongoose.connect(process.env.MONGO_URI);

export const Session = mongoose.model('Session', { socketId: String, word: String });
export default mongoose;
