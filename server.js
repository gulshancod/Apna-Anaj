import express from "express";
import dotenv from "dotenv";
import { connectMongoDB, getMongoDB, isMongoConnected } from "./server/db.js";
import { registerUser, loginUser, getUserFromToken, logoutUser } from "./server/auth.js";

dotenv.config();

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  const origin = req.headers.origin || "";

  const isAllowedOrigin =
    origin === "http://localhost:3000" ||
    origin === "http://localhost:5173" ||
    origin === "https://apna-anaj.vercel.app" ||
    /^https:\/\/[^/]+-gulshancod\.vercel\.app$/.test(origin);

  if (isAllowedOrigin) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Vary", "Origin");
  }

  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS"
  );
  res.header("Access-Control-Max-Age", "86400");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

const PORT = process.env.PORT || 5000;
const DATA_GOV_API_KEY = process.env.DATA_GOV_API_KEY;
const RESOURCE_ID = "9ef84268-d588-465a-a308-a864a43d0070";
const API_URL = `https://api.data.gov.in/resource/${RESOURCE_ID}`;

const CROP_ALIASES = {
  wheat: ["Wheat", "Gehu"],
  rice: ["Rice", "Paddy(Common)"],
  gram: ["Bengal Gram(Gram)(Whole)"],
  bajra: ["Bajra(Pearl Millet/Cumbu)"],
  tomato: ["Tomato"],
  onion: ["Onion"],
  potato: ["Potato"],
  bhindi: ["Bhindi(Ladies Finger)"],
  carrot: ["Carrot"],
  peas: ["Green Peas"],
  capsicum: ["Capsicum"],
  "bottle gourd": ["Bottle gourd"],
  brinjal: ["Brinjal"],
  cucumber: ["Cucumbar(Kheera)"],
  cauliflower: ["Cauliflower"],
  spinach: ["Spinach"],
  methi: ["Methi"],
  coriander: ["Coriander(Leaves)"],
  mango: ["Mango"],
  milk: ["Milk"],
  garlic: ["Garlic"]
};

const DEMO_MARKET_DATA = {
  milk: {
    average: 44,
    lowest: 40,
    highest: 48
  }
};

const GOV_CACHE_TTL_MS = 15 * 60 * 1000;
const GOV_REQUEST_GAP_MS = 800;
const govCache = new Map();
const govInflight = new Map();

function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

function getCropNames(crop) {
  const key = normalize(crop);
  return CROP_ALIASES[key] || [crop];
}

function getField(row, names) {
  for (const name of names) {
    if (row[name] !== undefined && row[name] !== null) {
      return row[name];
    }
  }
  return "";
}

function formatMarketData(records) {
  return records.map((row) => {
    const minPrice =
      Number(getField(row, ["min_price", "Min_x0020_Price", "Min Price"])) || 0;
    const maxPrice =
      Number(getField(row, ["max_price", "Max_x0020_Price", "Max Price"])) || 0;
    const modalPrice =
      Number(getField(row, ["modal_price", "Modal_x0020_Price", "Modal Price"])) || 0;

    return {
      state: getField(row, ["state", "State"]),
      district: getField(row, ["district", "District"]),
      market: getField(row, ["market", "Market"]),
      commodity: getField(row, ["commodity", "Commodity"]),
      variety: getField(row, ["variety", "Variety"]),
      grade: getField(row, ["grade", "Grade"]),
      arrivalDate: getField(row, ["arrival_date", "Arrival_Date", "Arrival Date"]),
      minPrice,
      maxPrice,
      modalPrice,
      minPricePerKg: Number((minPrice / 100).toFixed(2)),
      maxPricePerKg: Number((maxPrice / 100).toFixed(2)),
      modalPricePerKg: Number((modalPrice / 100).toFixed(2))
    };
  });
}

async function sleep(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchGovernmentData(crop) {
  const cacheKey = normalize(crop);
  const cached = govCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < GOV_CACHE_TTL_MS) {
    return cached.records;
  }

  const existingRequest = govInflight.get(cacheKey);
  if (existingRequest) {
    return existingRequest;
  }

  if (!DATA_GOV_API_KEY) {
    throw new Error("DATA_GOV_API_KEY missing in .env");
  }

  const requestPromise = (async () => {
    const cropNames = getCropNames(crop);
    let allRecords = [];

    for (const cropName of cropNames) {
      const params = new URLSearchParams({
        "api-key": DATA_GOV_API_KEY,
        format: "json",
        limit: "1000",
        "filters[commodity]": cropName
      });

      const url = `${API_URL}?${params.toString()}`;
      let response = null;
      let lastError = null;

      for (let attempt = 0; attempt < 3; attempt += 1) {
        try {
          if (attempt > 0) {
            await sleep(Math.min(2000 * attempt, 5000));
          }

          response = await fetch(url);

          if (response.ok) {
            break;
          }

          if (response.status === 429) {
            const retryAfter = Number(response.headers.get("retry-after"));
            const waitMs =
              Number.isFinite(retryAfter) && retryAfter > 0
                ? Math.min(retryAfter * 1000, 10000)
                : 2000 * (attempt + 1);

            await sleep(waitMs);
            continue;
          }

          lastError = new Error(`Government API error: ${response.status}`);
          break;
        } catch (error) {
          lastError = error;

          if (attempt < 2) {
            await sleep(1000 * (attempt + 1));
          }
        }
      }

      if (!response?.ok) {
        throw lastError || new Error("Government API request failed");
      }

      const result = await response.json();

      if (Array.isArray(result.records)) {
        allRecords = allRecords.concat(result.records);
      }

      if (cropNames.length > 1) {
        await sleep(GOV_REQUEST_GAP_MS);
      }
    }

    const uniqueRecords = Array.from(
      new Map(allRecords.map((row) => [JSON.stringify(row), row])).values()
    );

    govCache.set(cacheKey, {
      timestamp: Date.now(),
      records: uniqueRecords
    });

    return uniqueRecords;
  })();

  govInflight.set(cacheKey, requestPromise);

  try {
    return await requestPromise;
  } finally {
    govInflight.delete(cacheKey);
  }
}

function buildMarketSummary(crop, records) {
  const marketData = formatMarketData(records);

  const prices = marketData
    .map((row) => Number(row.modalPrice))
    .filter((price) => Number.isFinite(price) && price >= 100);

  if (!prices.length) {
    return null;
  }

  const average = prices.reduce((sum, price) => sum + price, 0) / prices.length;
  const lowest = Math.min(...prices);
  const highest = Math.max(...prices);
  const markets = new Set(
    marketData.map((row) => row.market).filter(Boolean)
  );

  return {
    success: true,
    availableData: true,
    isDemoData: false,
    source: "Government of India - AGMARKNET",
    sourceType: "Live Government API",
    crop,
    markets: markets.size,
    records: prices.length,
    priceUnit: "₹/Quintal",
    averageModalPrice: Math.round(average),
    lowestModalPrice: lowest,
    highestModalPrice: highest,
    priceUnitPerKg: "₹/KG",
    averageModalPricePerKg: Number((average / 100).toFixed(2)),
    lowestModalPricePerKg: Number((lowest / 100).toFixed(2)),
    highestModalPricePerKg: Number((highest / 100).toFixed(2))
  };
}

function getDemoSummary(crop) {
  const demo = DEMO_MARKET_DATA[crop];

  if (!demo) {
    return null;
  }

  return {
    success: true,
    availableData: true,
    isDemoData: true,
    source: "ApnaAnaj Demo Reference Data",
    sourceType: "Demo",
    crop,
    markets: 0,
    records: 1,
    priceUnit: "₹/KG",
    averageModalPricePerKg: demo.average,
    lowestModalPricePerKg: demo.lowest,
    highestModalPricePerKg: demo.highest
  };
}

function getBearerToken(req) {
  const header = String(req.headers.authorization || "");
  return header.startsWith("Bearer ") ? header.slice(7).trim() : "";
}

function requireMongo(req, res, next) {
  if (!process.env.MONGODB_URI || !isMongoConnected()) {
    return res.status(503).json({
      success: false,
      message: "Database is not connected. Configure MONGODB_URI on the backend."
    });
  }
  next();
}

app.post("/api/auth/register", async (req, res) => {
  try {
    const { role, name, phone, email, password, farm, location, address } = req.body || {};

    if (!process.env.MONGODB_URI) {
      return res.status(503).json({
        success: false,
        message: "MongoDB is not configured on the backend."
      });
    }

    await connectMongoDB();

    const session = await registerUser({
      role,
      name,
      phone,
      email,
      password,
      farm,
      location,
      address
    });

    return res.status(201).json({ success: true, ...session });
  } catch (error) {
    console.error("Registration error:", error);
    const duplicate = /already exists/i.test(error.message);
    return res.status(duplicate ? 409 : 400).json({
      success: false,
      message: error.message
    });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { role, identifier, password } = req.body || {};

    if (!process.env.MONGODB_URI) {
      return res.status(503).json({
        success: false,
        message: "MongoDB is not configured on the backend."
      });
    }

    await connectMongoDB();
    const session = await loginUser(identifier, password, role);

    return res.json({ success: true, ...session });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(401).json({
      success: false,
      message: error.message
    });
  }
});

app.get("/api/auth/me", requireMongo, async (req, res) => {
  try {
    const user = await getUserFromToken(getBearerToken(req));

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please log in again."
      });
    }

    return res.json({ success: true, user });
  } catch (error) {
    console.error("Session check error:", error);
    return res.status(401).json({
      success: false,
      message: "Unable to restore your session."
    });
  }
});

app.post("/api/auth/logout", requireMongo, async (req, res) => {
  try {
    await logoutUser(getBearerToken(req));
    return res.json({ success: true });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to log out."
    });
  }
});



const AI_LANGUAGE_NAMES = {
  en: "English",
  hinglish: "Hinglish",
  hi: "Hindi",
  mr: "Marathi",
  pa: "Punjabi",
  gu: "Gujarati",
  bn: "Bengali",
  te: "Telugu",
  ta: "Tamil",
  kn: "Kannada"
};

const AI_PAGE_DETAILS = {
  "view-welcome": "Welcome/Home page. It introduces Apna Anaj and lets users choose Buyer or Farmer.",
  "view-farmer-reg": "Farmer registration page. A farmer creates an account and enters farm/location details.",
  "view-buyer-reg": "Buyer registration page. A buyer creates an account and enters contact/address details.",
  "view-auth": "Login page for existing buyers and farmers.",
  "view-buyer-store": "Buyer Fresh Store. Buyers browse farm produce, see prices and farmer/location details, add items to basket, save favorites, and checkout.",
  "view-buyer-tracking": "Buyer Live Tracking. Shows the latest order status and delivery details.",
  "view-farmer-dash": "Farmer Dashboard. Shows the farmer's workflow and current produce information.",
  "view-add-produce": "Add Produce. Farmer enters crop, quantity, price, location and produce details for listing.",
  "view-demand-forecast": "AI Demand Forecast. Helps the farmer understand expected demand trends for the selected crop.",
  "view-selling-rec": "Selling Recommendation. Helps the farmer choose Sell Now, Wait, or Join Pool based on available demand signals.",
  "view-matching": "Buyer Matching. Matches farmer produce with buyer demand using crop, quantity, location and offer information.",
  "view-pooling": "Quantity Pooling. Farmers can combine quantities into a pool for larger buyer requirements.",
  "view-route": "EV Pickup Route. Shows the pickup/delivery route workflow for produce movement.",
  "view-transparency": "Price Transparency. Explains the price and payout flow so farmers can understand the transaction.",
  "view-orders": "Orders and Batches. Shows order/batch information for the current workflow."
};

function getPageDetails(page) {
  return AI_PAGE_DETAILS[page] || `Apna Anaj page: ${page || "unknown"}.`;
}

function buildLocalAssistantAnswer(message, page, language) {
  const q = normalize(message);
  const details = getPageDetails(page);

  if (/^(hi|hello|hey|namaste|namaskar)\b/.test(q) || q.length < 4) {
    return language === "en"
      ? "Hello! I am Apna Anaj AI. Ask me about this page, farming workflow, buyer features, selling, matching, pooling, orders, or how to use Apna Anaj."
      : "Namaste! Main Apna Anaj AI hoon. Is page, farming workflow, buyer features, selling, matching, pooling, orders ya website use karne ke baare mein poochho.";
  }

  if (q.includes("what is this page") || q.includes("this page") || q.includes("ye page") || q.includes("is page")) {
    return language === "en"
      ? details
      : `Ye page ${details.toLowerCase()} Main simple steps mein samjha sakta hoon.`;
  }

  if (q.includes("how to use") || q.includes("kaise use") || q.includes("kya kar") || q.includes("what can i do")) {
    return language === "en"
      ? `On this page: ${details} Follow the visible buttons/cards to continue the workflow. Ask me the exact feature name and I will explain it step by step.`
      : `Is page par: ${details} Aap visible buttons/cards se next step par ja sakte ho. Kisi exact feature ka naam bolo, main step-by-step samjha dunga.`;
  }

  if (q.includes("mandi") || q.includes("market price") || q.includes("rate")) {
    return language === "en"
      ? "The Mandi section is used for market-price information. For a specific crop and market, check the live market-rate area in the app. I will not invent a price when live data is unavailable."
      : "Mandi section market-price information ke liye hai. Specific crop aur market ka live rate app ke market-rate area mein check karo. Live data available na ho to main fake rate nahi bataunga.";
  }

  if (q.includes("demand forecast") || q.includes("forecast") || q.includes("demand")) {
    return language === "en"
      ? "AI Demand Forecast estimates demand direction for the selected crop so the farmer can plan selling. It is a decision-support feature, not a guaranteed future price or demand."
      : "AI Demand Forecast selected crop ki demand direction samajhne mein help karta hai, jisse farmer selling plan kar sake. Ye decision-support feature hai, guaranteed future price ya demand nahi.";
  }

  if (q.includes("sell now") || q.includes("wait") || q.includes("selling recommendation")) {
    return language === "en"
      ? "Selling Recommendation helps compare Sell Now, Wait, or Join Pool using the available demand/market signals shown by the app."
      : "Selling Recommendation available demand/market signals ke basis par Sell Now, Wait ya Join Pool options ko samajhne mein help karta hai.";
  }

  if (q.includes("buyer matching") || q.includes("matching") || q.includes("buyer")) {
    return language === "en"
      ? "Buyer Matching connects a farmer's produce with buyer requirements. The workflow considers information such as crop, quantity, location and buyer demand/offer details."
      : "Buyer Matching farmer ke produce ko buyer requirements se connect karta hai. Workflow mein crop, quantity, location aur buyer demand/offer jaise details use hote hain.";
  }

  if (q.includes("pool") || q.includes("pooling") || q.includes("quantity pooling")) {
    return language === "en"
      ? "Quantity Pooling lets farmers combine produce quantities so a larger buyer requirement can be handled collectively."
      : "Quantity Pooling mein farmers apni produce quantity combine kar sakte hain, jisse larger buyer requirement ko collectively fulfil kiya ja sake.";
  }

  if (q.includes("order") || q.includes("checkout") || q.includes("basket") || q.includes("cart")) {
    return language === "en"
      ? "For buyers, add produce to the basket, review the total, and continue to checkout. The order/tracking screens then show the latest order status."
      : "Buyer ke liye produce basket mein add karo, total review karo aur checkout karo. Uske baad order/tracking screen latest order status dikhati hai.";
  }

  return language === "en"
    ? `I can help with Apna Anaj and the current page. Current page: ${details} Ask your question with a little more detail and I will explain it step by step.`
    : `Main Apna Anaj aur current page ke baare mein help kar sakta hoon. Current page: ${details} Sawaal thoda detail mein poochho, main step-by-step explain kar dunga.`;
}

async function generateAssistantAnswer(message, page, language) {
  const safeLanguage = AI_LANGUAGE_NAMES[language] ? language : "hinglish";
  const systemPrompt = [
    "You are Apna Anaj AI, a helpful agricultural marketplace assistant embedded inside the Apna Anaj web app.",
    "Answer general questions normally, but never invent live market prices, account data, order data, or private information.",
    "For questions about the current page, explain the page purpose, visible workflow, what the user can do there, and the next useful action.",
    "For farming and marketplace concepts, explain in simple practical language with examples when helpful.",
    "When the user asks for steps, use short numbered steps.",
    "Be clear, friendly, concise, and useful for Indian farmers and buyers.",
    `Reply in ${AI_LANGUAGE_NAMES[safeLanguage]}.`,
    `Current page: ${page || "unknown"}.`,
    `Page details: ${getPageDetails(page)}`
  ].join(" ");

  if (process.env.GEMINI_API_KEY) {
    const models = [
      process.env.GEMINI_MODEL,
      "gemini-2.5-flash",
      "gemini-2.0-flash"
    ].filter(Boolean);

    let lastError = null;
    for (const model of [...new Set(models)]) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`;
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: systemPrompt }] },
            contents: [{ role: "user", parts: [{ text: message }] }],
            generationConfig: {
              temperature: 0.4,
              maxOutputTokens: 700
            }
          })
        });
        const data = await response.json();
        if (!response.ok) {
          lastError = new Error(data?.error?.message || `Gemini request failed for ${model}.`);
          continue;
        }
        const answer = data?.candidates?.[0]?.content?.parts?.map((part) => part?.text || "").join("").trim();
        if (answer) return answer;
        lastError = new Error("Gemini returned an empty response.");
      } catch (error) {
        lastError = error;
      }
    }
    console.error("Gemini assistant failed:", lastError);
  }

  if (process.env.OPENROUTER_API_KEY) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": "https://apna-anaj.vercel.app",
          "X-Title": "Apna Anaj"
        },
        body: JSON.stringify({
          model: process.env.OPENROUTER_MODEL || "openai/gpt-oss-20b:free",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message }
          ],
          temperature: 0.4,
          max_tokens: 700
        })
      });
      const data = await response.json();
      if (response.ok) {
        const answer = data?.choices?.[0]?.message?.content?.trim();
        if (answer) return answer;
      } else {
        console.error("OpenRouter assistant failed:", data?.error?.message || response.status);
      }
    } catch (error) {
      console.error("OpenRouter assistant request error:", error);
    }
  }

  return buildLocalAssistantAnswer(message, page, safeLanguage);
}

app.get("/api/ai-assistant/health", async (req, res) => {
  return res.json({
    success: true,
    configured: Boolean(process.env.GEMINI_API_KEY || process.env.OPENROUTER_API_KEY),
    provider: process.env.GEMINI_API_KEY ? "gemini" : (process.env.OPENROUTER_API_KEY ? "openrouter" : "local-fallback")
  });
});

app.post("/api/ai-assistant", async (req, res) => {
  try {
    const message = String(req.body?.message || "").trim();
    const page = String(req.body?.page || "unknown").trim();
    const language = String(req.body?.language || "hinglish").trim();

    if (!message) {
      return res.status(400).json({ success: false, message: "Message is required." });
    }

    const answer = await generateAssistantAnswer(message, page, language);
    return res.json({
      success: true,
      answer,
      page,
      language,
      provider: process.env.GEMINI_API_KEY
        ? "gemini"
        : (process.env.OPENROUTER_API_KEY ? "openrouter" : "local-fallback")
    });
  } catch (error) {
    console.error("AI assistant error:", error);
    return res.status(503).json({
      success: false,
      message: "AI assistant is temporarily unavailable. Please try again."
    });
  }
});

app.get("/api/db-test", async (req, res) => {
  try {
    if (!process.env.MONGODB_URI) {
      return res.status(503).json({
        success: false,
        connected: false,
        message: "MONGODB_URI is not configured on the backend."
      });
    }

    await connectMongoDB();
    const db = getMongoDB();
    const ping = await db.command({ ping: 1 });

    return res.json({
      success: true,
      connected: isMongoConnected(),
      database: db.databaseName,
      pingOk: ping.ok === 1
    });
  } catch (error) {
    console.error("MongoDB health check error:", error);
    return res.status(503).json({
      success: false,
      connected: false,
      message: error.message
    });
  }
});

app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "ApnaAnaj backend is working!",
    governmentAPI: Boolean(DATA_GOV_API_KEY)
  });
});

app.get("/api/market-data", async (req, res) => {
  try {
    const crop = normalize(req.query.crop || "Tomato");
    const records = await fetchGovernmentData(crop);

    if (records.length > 0) {
      const marketData = formatMarketData(records);

      return res.json({
        success: true,
        availableData: true,
        isDemoData: false,
        source: "Government of India - AGMARKNET",
        sourceType: "Live Government API",
        priceUnit: "₹/Quintal",
        convertedPriceUnit: "₹/KG",
        crop,
        records: marketData.length,
        data: marketData
      });
    }

    const demo = getDemoSummary(crop);

    if (demo) {
      return res.json({
        ...demo,
        data: [
          {
            state: "Demo",
            district: "Demo",
            market: "ApnaAnaj Demo Market",
            commodity: crop,
            variety: "Demo",
            grade: "Demo",
            arrivalDate: new Date().toISOString().split("T")[0],
            minPrice: demo.lowestModalPricePerKg,
            maxPrice: demo.highestModalPricePerKg,
            modalPrice: demo.averageModalPricePerKg,
            minPricePerKg: demo.lowestModalPricePerKg,
            maxPricePerKg: demo.highestModalPricePerKg,
            modalPricePerKg: demo.averageModalPricePerKg
          }
        ]
      });
    }

    return res.json({
      success: false,
      availableData: false,
      isDemoData: false,
      crop,
      records: 0,
      message: "No government mandi data found for this crop."
    });
  } catch (error) {
    console.error("Market data error:", error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.get("/api/market-summary", async (req, res) => {
  try {
    const crop = normalize(req.query.crop || "Tomato");
    const records = await fetchGovernmentData(crop);

    if (records.length > 0) {
      const summary = buildMarketSummary(crop, records);

      if (summary) {
        return res.json(summary);
      }
    }

    const demo = getDemoSummary(crop);

    if (demo) {
      return res.json(demo);
    }

    return res.json({
      success: false,
      availableData: false,
      isDemoData: false,
      crop,
      markets: 0,
      records: 0,
      message: "No government mandi price data found for this crop."
    });
  } catch (error) {
    console.error("Market summary error:", error);

    return res.status(503).json({
      success: false,
      availableData: false,
      isDemoData: false,
      crop: normalize(req.query.crop || "Tomato"),
      error: error.message,
      message: "Government mandi service is temporarily unavailable."
    });
  }
});

app.get("/api/market-summary-batch", async (req, res) => {
  try {
    const raw = String(req.query.crops || "");
    const crops = Array.from(
      new Set(
        raw.split(",").map(normalize).filter(Boolean)
      )
    ).slice(0, 25);

    if (!crops.length) {
      return res.status(400).json({
        success: false,
        message: "At least one crop is required."
      });
    }

    const entries = [];

    for (const crop of crops) {
      try {
        const records = await fetchGovernmentData(crop);

        if (records.length > 0) {
          const summary = buildMarketSummary(crop, records);
          if (summary) {
            entries.push([crop, summary]);
            continue;
          }
        }

        const demo = getDemoSummary(crop);
        entries.push([
          crop,
          demo || {
            success: false,
            availableData: false,
            isDemoData: false,
            message: "No government mandi data found for this crop."
          }
        ]);
      } catch (error) {
        entries.push([
          crop,
          {
            success: false,
            availableData: false,
            isDemoData: false,
            error: error.message,
            message: "Government mandi service is temporarily unavailable."
          }
        ]);
      }

      await sleep(250);
    }

    return res.json({
      success: true,
      requested: crops.length,
      data: Object.fromEntries(entries)
    });
  } catch (error) {
    console.error("Batch market summary error:", error);

    return res.status(503).json({
      success: false,
      message: error.message
    });
  }
});

app.get("/api/price-comparison", async (req, res) => {
  try {
    const crop = normalize(req.query.crop || "Tomato");
    const cropNames = getCropNames(crop);

    const today = new Date();

    const formatMandiDate = (date) => {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };

    const currentDate = formatMandiDate(today);
    const lastMonth = new Date(today);
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const lastMonthDate = formatMandiDate(lastMonth);

    async function fetchPriceByDate(date) {
      let allRecords = [];

      for (const cropName of cropNames) {
        const url = new URL(API_URL);
        url.searchParams.set("api-key", DATA_GOV_API_KEY);
        url.searchParams.set("format", "json");
        url.searchParams.set("limit", "1000");
        url.searchParams.set("filters[commodity]", cropName);
        url.searchParams.set("filters[arrival_date]", date);

        const response = await fetch(url.toString());

        if (!response.ok) {
          continue;
        }

        const data = await response.json();

        if (Array.isArray(data.records)) {
          allRecords.push(...data.records);
        }
      }

      return Array.from(
        new Map(
          allRecords.map((row) => [JSON.stringify(row), row])
        ).values()
      );
    }

    const currentRecords = await fetchPriceByDate(currentDate);
    const lastMonthRecords = await fetchPriceByDate(lastMonthDate);

    function getAveragePrice(records) {
      const formatted = formatMarketData(records);

      const prices = formatted
        .map((item) => Number(item.modalPrice))
        .filter(
          (price) => Number.isFinite(price) && price >= 100
        );

      if (!prices.length) {
        return null;
      }

      return Number(
        (
          prices.reduce((sum, price) => sum + price, 0) /
          prices.length /
          100
        ).toFixed(2)
      );
    }

    const currentPricePerKg = getAveragePrice(currentRecords);
    const lastMonthPricePerKg = getAveragePrice(lastMonthRecords);

    if (
      currentPricePerKg === null ||
      lastMonthPricePerKg === null
    ) {
      return res.status(404).json({
        success: false,
        availableData: false,
        isDemoData: false,
        message:
          "Historical mandi price data is not available for the selected date.",
        crop,
        currentDate,
        lastMonthDate
      });
    }

    const changePercent = Number(
      (
        ((currentPricePerKg - lastMonthPricePerKg) /
          lastMonthPricePerKg) *
        100
      ).toFixed(2)
    );

    let priceLevel = "MEDIUM";

    if (changePercent >= 10) {
      priceLevel = "HIGH";
    } else if (changePercent <= -10) {
      priceLevel = "LOW";
    }

    return res.json({
      success: true,
      availableData: true,
      isDemoData: false,
      source: "Government of India - AGMARKNET",
      sourceType: "Government Daily Mandi Data",
      crop,
      currentDate,
      lastMonthDate,
      currentPricePerKg,
      lastMonthPricePerKg,
      changePercent,
      priceLevel
    });
  } catch (error) {
    console.error("Price comparison error:", error.message);

    return res.status(503).json({
      success: false,
      availableData: false,
      isDemoData: false,
      message: "Government historical mandi service is temporarily unavailable."
    });
  }
});

async function startServer() {
  if (process.env.MONGODB_URI) {
    try {
      await connectMongoDB();
      console.log(`MongoDB: CONNECTED (${getMongoDB().databaseName})`);
    } catch (error) {
      console.error("MongoDB connection failed:", error.message);
      console.warn("Backend will continue running without MongoDB.");
    }
  } else {
    console.warn("MongoDB: NOT CONFIGURED (set MONGODB_URI)");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Backend running on http://localhost:${PORT}`);
    console.log(
      `Government API: ${DATA_GOV_API_KEY ? "CONNECTED" : "NOT CONNECTED"}`
    );
  });
}

export { app };

if (process.env.VERCEL !== "1") {
  startServer();
}
