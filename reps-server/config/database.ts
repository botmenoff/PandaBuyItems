import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/repproject";

export async function connectDB() {
    try {
        await mongoose.connect(MONGO_URI, {
        } as any); // Evitar advertencias en TypeScript
        console.log("✅ MongoDB conectado con éxito");
    } catch (error) {
        console.error("❌ Error conectando a MongoDB:", error);
        process.exit(1);
    }
}
