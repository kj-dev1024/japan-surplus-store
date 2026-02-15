/**
 * Seed the first admin user from env (ADMIN_USERNAME, ADMIN_PASSWORD).
 * Run once after setting up MongoDB: npm run seed
 * Uses .env.local if present, otherwise .env.
 */
const path = require("path");
const fs = require("fs");

// Load .env.local or .env
const envLocal = path.join(process.cwd(), ".env.local");
const envFile = path.join(process.cwd(), ".env");
if (fs.existsSync(envLocal)) {
  require("dotenv").config({ path: envLocal });
} else {
  require("dotenv").config({ path: envFile });
}

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, required: true, enum: ["admin"], default: "admin" },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);

async function seed() {
  if (!MONGODB_URI) {
    console.error("Missing MONGODB_URI in .env.local");
    process.exit(1);
  }
  if (!ADMIN_PASSWORD) {
    console.error(
      "Missing ADMIN_PASSWORD in .env.local (needed only for first-time seed)"
    );
    process.exit(1);
  }

  const opts = MONGODB_DB_NAME ? { dbName: MONGODB_DB_NAME } : {};
  await mongoose.connect(MONGODB_URI, opts);
  const existing = await User.findOne({ role: "admin" });
  if (existing) {
    console.log("Admin user already exists. Skipping seed.");
    await mongoose.disconnect();
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await User.create({
    username: ADMIN_USERNAME,
    passwordHash,
    role: "admin",
  });
  console.log(`Admin user "${ADMIN_USERNAME}" created. You can now log in.`);
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
