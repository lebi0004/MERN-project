import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string; // hashed
}

const UserSchema = new Schema<IUser>(
  {
    email:   { type: String, required: true, unique: true, trim: true, lowercase: true },
    password:{ type: String, required: true },
  },
  { timestamps: true }
);

// Helpful index to enforce uniqueness
UserSchema.index({ email: 1 }, { unique: true });

export default model<IUser>('User', UserSchema);
