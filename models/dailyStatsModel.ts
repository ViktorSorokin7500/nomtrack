import mongoose, { Schema, Document, Model } from "mongoose";

// Інтерфейс
interface IDailyStats extends Document {
  id: string;
  userId: string;
  date: string;
  weight: number;
  createdAt: Date;
  updatedAt: Date;
}

// Схема
const dailyStatsSchema = new Schema<IDailyStats>(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    date: { type: String, required: true },
    weight: { type: Number, required: true },
  },
  { timestamps: true }
);

// Унікальний індекс для userId+date
dailyStatsSchema.index({ userId: 1, date: 1 }, { unique: true });

// Модель
const DailyStats: Model<IDailyStats> =
  mongoose.models.DailyStats ||
  mongoose.model<IDailyStats>("DailyStats", dailyStatsSchema);

export default DailyStats;
