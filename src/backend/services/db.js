import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI;

let client;
let clientPromise;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri);
  global._mongoClientPromise = client.connect();
}

clientPromise = global._mongoClientPromise;

export const addToWaitlist = async () => {
  const client = await clientPromise;

  // 👇 DB auto-picked from URI (Beriko)
  const db = client.db();

  return db.collection("waitlist").insertOne({
    createdAt: new Date(),
  });
};
