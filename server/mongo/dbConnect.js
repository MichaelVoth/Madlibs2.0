import mongoose from "mongoose";

async function dbConnect() {
  try {
    const DB_URI = process.env.DB_URI || 'mongodb://127.0.0.1:27017/madlibsDB';

    await mongoose.connect(DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    });

    console.log("Established a connection to the database");
    
    mongoose.connection.on("error", () => {
      throw new Error("Could not connect to DB.");
    });
  } catch (error) {
    console.log(error)
  }
}

export default dbConnect;
