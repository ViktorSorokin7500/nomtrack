import mongoose, { Schema, Document, Model } from "mongoose";

interface IUser extends Document {
  id: string;
  createdAt: Date;
  targetCalories: number;
  targetMacros: {
    protein: number;
    carbs: number;
    fat: number;
  };
}

const userSchema = new Schema<IUser>(
  {
    id: { type: String, required: true, unique: true }, // Clerk userId
    createdAt: { type: Date, required: true, default: Date.now },
    targetCalories: { type: Number, required: true },
    targetMacros: {
      protein: { type: Number, required: true },
      carbs: { type: Number, required: true },
      fat: { type: Number, required: true },
    },
  },
  { timestamps: true }
);

userSchema.index({ id: 1 }, { unique: true });

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
