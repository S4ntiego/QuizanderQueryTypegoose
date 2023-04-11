import mongoose from "mongoose";
import config from "config";

const dbUrl = `mongodb+srv://${config.get("dbName")}:${config.get(
  "dbPass"
)}@cluster0.reedq7w.mongodb.net/?retryWrites=true&w=majority`;

const connectDb = async () => {
  try {
    await mongoose.set("strictQuery", false).connect(dbUrl);
    console.log("Database connected.");
  } catch (error: any) {
    console.log(error.message);
  }
};

export default connectDb;
