import * as mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    userName: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    verified: {type: Boolean, required: true, default: false},
    isBanned: {type: String, required: true},
    profilePic: {type: String, required: true},
  },
);

export type User = mongoose.InferSchemaType<typeof userSchema>;
export const User = mongoose.model('User', userSchema);