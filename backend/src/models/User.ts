import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  username: string;
  displayName: string;
  profileImage?: string;
  followers: string[];
  following: string[];
  playlists: string[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    displayName: {
      type: String,
      required: true,
      trim: true,
    },
    profileImage: {
      type: String,
      default: '',
    },
    followers: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    following: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    playlists: [{
      type: Schema.Types.ObjectId,
      ref: 'Playlist',
    }],
  },
  {
    timestamps: true,
  }
);

// Create indexes for faster queries
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });

export const User = model<IUser>('User', userSchema); 