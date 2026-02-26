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
const TCG_BASE = "https://api.pokemontcg.io/v2";

function tcgHeaders() {
  const headers = { "Content-Type": "application/json" };
  if (process.env.POKEMON_TCG_API_KEY) headers["X-Api-Key"] = process.env.POKEMON_TCG_API_KEY;
  return headers;
}

function uploadBufferToCloudinary(buffer, options = {}) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
    stream.end(buffer);
  });
}

app.get("/api/cards/search", async (req, res) => {
 
  const q = req.query.q ?? "";
  const url = new URL("/v2/cards", "https://api.pokemontcg.io");
  url.searchParams.set("q", q);
  url.searchParams.set("pageSize", "12");

  // ✅ MOCK TOGGLE (reads from server/.env)
  const USE_MOCK = process.env.USE_TCG_MOCK === "1";

  // ✅ Step 2 goes RIGHT HERE (before fetch)
  if (USE_MOCK) {
    return res.json({
      data: [
        {
          id: "base1-4",
          name: "Charizard",
          set: { name: "Base" },
          number: "4",
          images: { small: "", large: "" },
        },
        {
          id: "base1-2",
          name: "Blastoise",
          set: { name: "Base" },
          number: "2",
          images: { small: "", large: "" },
        },
        {
          id: "base1-15",
          name: "Venusaur",
          set: { name: "Base" },
          number: "15",
          images: { small: "", large: "" },
        },
      ],
      page: 1,
      pageSize: 12,
      count: 3,
      totalCount: 3,
      mocked: true,
      query: q,
    });
  }

  try {
    const r = await fetch(url.toString(), { headers: tcgHeaders() });

    const text = await r.text();

    // Upstream is down or returning nothing
    if (!text) {
      return res.status(502).json({
        error: "Upstream Pokémon TCG API returned an empty response",
        upstreamStatus: r.status,
        upstreamStatusText: r.statusText,
      });
    }

    // Try JSON; if not JSON (e.g., HTML error page), return preview
    try {
      const data = JSON.parse(text);
      return res.status(r.status).json(data);
    } catch {
      return res.status(502).json({
        error: "Upstream Pokémon TCG API returned a non-JSON response (likely outage/edge error)",
        upstreamStatus: r.status,
        upstreamStatusText: r.statusText,
        bodyPreview: text.slice(0, 200),
      });
    }
  } catch (e) {
    return res.status(502).json({
      error: "Failed to reach Pokémon TCG API (network/outage)",
      details: String(e),
    });
  }
});

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

app.get("/", (req, res) => {
  res.send("Server is running. Try /api/health or /api/cards/search?q=name:charizard");
});


// Health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running" });
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