import crypto from "node:crypto";
import { getMongoDB } from "./db.js";

const SESSION_DAYS = 30;

function normalizePhone(phone = "") {
  return String(phone).replace(/\D/g, "");
}

function normalizeEmail(email = "") {
  return String(email).trim().toLowerCase();
}

function normalizeIdentifier(identifier = "") {
  const value = String(identifier).trim();
  return value.includes("@") ? normalizeEmail(value) : normalizePhone(value);
}

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.scryptSync(String(password), salt, 64).toString("hex");
  return { salt, hash };
}

function verifyPassword(password, salt, expectedHash) {
  const actual = crypto.scryptSync(String(password), salt, 64);
  const expected = Buffer.from(expectedHash, "hex");
  return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
}

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function toPublicUser(user) {
  return {
    id: String(user._id),
    role: user.role,
    name: user.name,
    phone: user.phone,
    email: user.email || "",
    farm: user.farm || "",
    location: user.location || "",
    address: user.address || ""
  };
}

async function ensureAuthIndexes() {
  const db = getMongoDB();
  await db.collection("users").createIndex({ phone: 1 }, { unique: true });
  await db.collection("users").createIndex({ email: 1 }, { unique: true, sparse: true });
  await db.collection("sessions").createIndex({ tokenHash: 1 }, { unique: true });
  await db.collection("sessions").createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
}

export async function registerUser({
  role,
  name,
  phone,
  password,
  email = "",
  farm = "",
  location = "",
  address = ""
}) {
  if (!["buyer", "farmer"].includes(role)) {
    throw new Error("Invalid account role.");
  }

  const cleanName = String(name || "").trim();
  const cleanPhone = normalizePhone(phone);
  const cleanEmail = normalizeEmail(email);
  const cleanPassword = String(password || "");

  if (cleanName.length < 2) throw new Error("Please enter your full name.");
  if (cleanPhone.length < 10) throw new Error("Please enter a valid mobile number.");
  if (cleanPassword.length < 6) throw new Error("Password must be at least 6 characters.");

  await ensureAuthIndexes();

  const db = getMongoDB();
  const users = db.collection("users");

  const existing = await users.findOne({
    $or: [
      { phone: cleanPhone },
      ...(cleanEmail ? [{ email: cleanEmail }] : [])
    ]
  });

  if (existing) {
    throw new Error("An account with this mobile number or email already exists.");
  }

  const { salt, hash } = hashPassword(cleanPassword);

  const user = {
    role,
    name: cleanName,
    phone: cleanPhone,
    ...(cleanEmail ? { email: cleanEmail } : {}),
    farm: String(farm || "").trim(),
    location: String(location || "").trim(),
    address: String(address || "").trim(),
    passwordSalt: salt,
    passwordHash: hash,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const result = await users.insertOne(user);
  const createdUser = { ...user, _id: result.insertedId };

  return createSession(createdUser);
}

export async function loginUser(identifier, password, role) {
  const cleanIdentifier = normalizeIdentifier(identifier);
  const cleanPassword = String(password || "");

  if (!cleanIdentifier || !cleanPassword) {
    throw new Error("Mobile/email and password are required.");
  }

  await ensureAuthIndexes();

  const db = getMongoDB();
  const user = await db.collection("users").findOne({
    ...(role ? { role } : {}),
    $or: [
      { phone: cleanIdentifier },
      { email: cleanIdentifier }
    ]
  });

  if (!user || !verifyPassword(cleanPassword, user.passwordSalt, user.passwordHash)) {
    throw new Error("Invalid login details.");
  }

  return createSession(user);
}

export async function createSession(user) {
  const db = getMongoDB();
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);

  await db.collection("sessions").insertOne({
    tokenHash: hashToken(token),
    userId: user._id,
    createdAt: new Date(),
    expiresAt
  });

  return {
    token,
    user: toPublicUser(user)
  };
}

export async function getUserFromToken(token) {
  if (!token) return null;

  const db = getMongoDB();
  const session = await db.collection("sessions").findOne({
    tokenHash: hashToken(token),
    expiresAt: { $gt: new Date() }
  });

  if (!session) return null;

  const user = await db.collection("users").findOne({
    _id: session.userId
  });

  return user ? toPublicUser(user) : null;
}

export async function logoutUser(token) {
  if (!token) return;
  const db = getMongoDB();
  await db.collection("sessions").deleteOne({
    tokenHash: hashToken(token)
  });
}
