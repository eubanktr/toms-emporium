import express from "express";
import { ObjectId } from "mongodb";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import cloudinary from "./cloudinary.js";
import { upload } from "./upload.js";
import fs from "fs";
import { connectDB, db } from "./mongo.js";

dotenv.config();

const app = express();

function uploadBufferToCloudinary(buffer, options = {}) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
    stream.end(buffer);
  });
}



const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Missing MONGODB_URI env var");
}

const client = new MongoClient(MONGODB_URI);
let db;

async function getDb() {
  if (db) return db;
  await client.connect();
  // use an env var if you want, or hardcode your DB name:
  db = client.db(process.env.MONGODB_DB || "toms_emporium");
  return db;
}


const __dirname = path.resolve();

// ensure uploads folder exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// serve uploaded files publicly
app.use("/uploads", express.static(uploadDir));

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.get("/", (req, res) =>
  res.send("Server is running. Try /api/health or /api/cards/search?q=name:charizard.")
);

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.get("/api/sale", async (req, res) => {
  try {
    const db = await getDb();
    const items = await db
      .collection("saleListings")
      .find({})
      .sort({ updatedAt: -1 })
      .limit(200)
      .toArray();

    res.json(items);
  } catch (err) {
    console.error("GET /api/sale failed:", err);
    res.status(500).json({ error: "Failed to load listings" });
  }
});

// Local run only
// const PORT = process.env.PORT || 4000;

// Declare listen
 const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

await connectDB();

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

// List Sale listings
app.get("/api/sale", async (req, res) => {
  try {
    const listings = await db.collection("saleListings")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    res.json(listings);
  } catch (e) {
    res.status(500).json({ error: "Failed to load listings", details: String(e) });
  }
});

app.get("/api/sale/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid id" });
    }

    const doc = await db.collection("saleListings").findOne({ _id: new ObjectId(id) });

    if (!doc) return res.status(404).json({ error: "Listing not found" });

    res.json(doc);
  } catch (e) {
    console.error("GET /api/sale/:id failed:", e);
    res.status(500).json({ error: "Failed to load listing", details: String(e) });
  }
});

// Create listing with up to 6 photos
app.post("/api/sale", upload.array("photos", 6), async (req, res) => {
  try {
    const {
      name, set, number, rarity, type, edition, foil,
      priceCents, quantity, condition, notes
    } = req.body;

    if (!name?.trim()) return res.status(400).json({ error: "Card name is required" });

    // Upload each file to Cloudinary and collect secure URLs
    const files = req.files || [];
    const uploads = await Promise.all(
      files.map((f) =>
        uploadBufferToCloudinary(f.buffer, {
          folder: "toms-emporium/sale",
          resource_type: "image",
        })
      )
    );

    const photoUrls = uploads.map((u) => u.secure_url); // ✅ store these in MongoDB

    const doc = {
      card: {
        name: name.trim(),
        set: (set || "").trim(),
        number: (number || "").trim(),
        rarity: (rarity || "").trim(),
        type: (type || "").trim(),
        edition: (edition || "").trim(),
        foil: String(foil).toLowerCase() === "true" || String(foil).toLowerCase() === "yes",
      },
      photos: photoUrls, // ✅ up to 6 Cloudinary URLs
      priceCents: priceCents ? Number(priceCents) : 0,
      quantity: quantity ? Number(quantity) : 1,
      condition: (condition || "").trim(),
      notes: (notes || "").trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("saleListings").insertOne(doc);
    res.status(201).json({ ok: true, id: result.insertedId, doc });
  } catch (e) {
    console.error("POST /api/sale failed:", e);
    res.status(500).json({ error: "Failed to create listing", details: String(e) });
  }
});