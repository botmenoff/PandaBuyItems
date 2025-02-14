const mongoose = require('mongoose');
require('dotenv').config();

const uri = `mongodb+srv://${process.env.MONGOUSER}:${process.env.MONGOPASSWORD}@cluster0.4usumbt.mongodb.net/ProjectDatabase?retryWrites=true&w=majority`;

const connectToDatabase = async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // 10 segundos
    });
    console.log("Connected to MongoDB!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

connectToDatabase();
