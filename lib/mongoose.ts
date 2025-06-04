import mongoose, { Mongoose } from "mongoose";

interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// Кешуємо підключення глобально
const globalWithMongoose = global as typeof globalThis & {
  mongoose: MongooseCache;
};

const cached: MongooseCache = globalWithMongoose.mongoose || {
  conn: null,
  promise: null,
};

if (!globalWithMongoose.mongoose) {
  globalWithMongoose.mongoose = cached;
}

export const connectionToDB = async () => {
  // Перевіряємо, чи є активне підключення
  if (cached.conn) {
    console.log("MongoDB is already connected");
    return cached.conn;
  }

  // Перевіряємо, чи є активна спроба підключення
  if (!cached.promise) {
    if (!process.env.MONGODB_URI) {
      throw new Error("MISSING MONGODB_URI");
    }

    mongoose.set("strictQuery", true);

    cached.promise = mongoose
      .connect(process.env.MONGODB_URI, {
        bufferCommands: false, // Відключаємо буферизацію для серверних компонентів
      })
      .then((mongoose) => {
        console.log("MongoDB is connected");
        return mongoose;
      })
      .catch((error) => {
        console.error("MongoDB connection failed", error);
        throw error; // Кидаємо помилку для обробки в компонентах
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } finally {
    cached.promise = null; // Очищаємо проміс після завершення
  }
};
