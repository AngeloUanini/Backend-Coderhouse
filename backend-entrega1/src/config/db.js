import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://AngeloBack:perrito1@cluster0.y81wavt.mongodb.net/?appName=Cluster0",
      {
        dbName: "ecommerce"
      }
    );
    console.log("🟢 MongoDB conectado");
  } catch (error) {
    console.error("🔴 Error conectando MongoDB", error);
  }
};
