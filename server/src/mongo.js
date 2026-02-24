import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri);

export let db;

export async function connectDB() {
  await client.connect();
  db = client.db("toms_emporium"); // database name
  console.log("Connected to MongoDB Atlas");
}