import mongoose, { Schema, Document, Model } from "mongoose";

interface IMeal extends Document {
  id: string;
  userId: string;
  date: string;
  type: string;
  snackIndex: number | null;
  name: string;
  description: string;
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const mealSchema = new Schema<IMeal>(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    date: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: ["Breakfast", "Lunch", "Dinner", "Snack"],
    },
    snackIndex: { type: Number, required: false },
    name: { type: String, required: true },
    description: { type: String, required: true },
    calories: { type: Number, required: true },
    macros: {
      protein: { type: Number, required: true },
      carbs: { type: Number, required: true },
      fat: { type: Number, required: true },
    },
  },
  { timestamps: true }
);

mealSchema.index({ userId: 1, date: 1 });

const Meal: Model<IMeal> =
  mongoose.models.Meal || mongoose.model<IMeal>("Meal", mealSchema);

export default Meal;
