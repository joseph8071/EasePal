import { connect, disconnect } from "mongoose";
async function connectToDatabase() {
  try {
    await connect(process.env.MONGODB_URL);
  } catch (error) {
    console.log(error);
    throw new Error("Error connecting to MongoDB");
  }
}

async function disconnectFromDatabase() {
  try {
    await disconnect();
  } catch (error) {
    console.log(error);
    throw new Error("Error disconnecting from MongoDB");
  }
}

export { connectToDatabase, disconnectFromDatabase };
