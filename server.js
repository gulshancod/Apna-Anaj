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
  "view-welcome": "Welcome/Home page",
  "view-farmer-reg": "Farmer registration page",
  "view-buyer-reg": "Buyer registration page",
  "view-auth": "Login page",
  "view-buyer-store": "Buyer Fresh Store",
  "view-buyer-tracking": "Buyer Live Tracking",
  "view-farmer-dash": "Farmer Dashboard",
  "view-add-produce": "Add Produce",
  "view-demand-forecast": "AI Demand Forecast",
  "view-selling-rec": "Selling Recommendation",
  "view-matching": "Buyer Matching",
  "view-pooling": "Quantity Pooling",
  "view-route": "EV Pickup Route",
  "view-transparency": "Price Transparency",
  "view-orders": "Orders and Batches"
};

function getPageDetails(page) {
  return AI_PAGE_DETAILS[page] || "the current Apna Anaj page";
}

function normalizeAssistantLanguage(value) {
  const raw = normalize(value);
  if (raw === "hindi" || raw === "हिंदी" || raw === "hi") return "hi";
  if (raw === "hinglish") return "hinglish";
  if (raw === "english" || raw === "en") return "en";
  return AI_LANGUAGE_NAMES[raw] ? raw : "hi";
}

function buildAssistantSystemPrompt(message, page, language) {
  const lang = normalizeAssistantLanguage(language);
  const pageDetails = getPageDetails(page);
  return [
    "You are Apna Anaj AI, a real conversational assistant for the Apna Anaj app.",
    "Understand the user's actual question first. Do not force every question into the website or current-page context.",
    "You may answer general knowledge questions, farming questions, technology questions, and questions about Apna Anaj.",
    "Only discuss the current page when it is relevant to the user's question or when they ask about the page.",
    "Never repeat generic page descriptions when the user asks a different topic.",
    "Prefer accurate, direct answers. When current or changing facts are needed, use web search if available.",
    "Never invent live prices, current events, current government data, account data, orders, or private information.",
    "When discussing Apna Anaj features, use only the supplied feature context and clearly state when a feature is conceptual or unavailable.",
    "Reply primarily in the requested language and match the user's language when they write in Hindi/Hinglish.",
    "For Hindi, write natural Hindi in Devanagari. For Hinglish, use natural Roman Hindi.",
    "Keep answers conversational, helpful, and easy to understand.",
    "If the user asks a simple question, answer it simply. Do not add unrelated website details.",
    `Requested language: ${AI_LANGUAGE_NAMES[lang] || "Hindi"}.`,
    `Current page: ${pageDetails}.`,
    `User message: ${message}`
  ].join("\n");
}

async function callOpenAIWebAssistant(message, page, language) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const model = process.env.OPENAI_MODEL || "gpt-5.6-luna";
  const input = buildAssistantSystemPrompt(message, page, language);

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      input,
      tools: [{ type: "web_search_preview" }],
      max_output_tokens: 900
    })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error?.message || "OpenAI request failed.");
  }

  const answer =
    data?.output_text ||
    data?.output?.flatMap((item) => item?.content || [])
      ?.map((item) => item?.text || "")
      ?.join("")
      ?.trim();

  if (!answer) {
    throw new Error("OpenAI returned an empty answer.");
  }

  return answer.trim();
}

async function callGeminiAssistant(message, page, language) {
  if (!process.env.GEMINI_API_KEY) return null;

  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const systemPrompt = buildAssistantSystemPrompt(message, page, language);

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: systemPrompt }] },
      contents: [{ role: "user", parts: [{ text: message }] }],
      generationConfig: {
        temperature: 0.25,
        maxOutputTokens: 900
      }
    })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error?.message || "Gemini request failed.");
  }

  const answer = data?.candidates?.[0]?.content?.parts
    ?.map((part) => part?.text || "")
    .join("")
    .trim();

  if (!answer) throw new Error("Gemini returned an empty answer.");
  return answer;
}

async function callOpenRouterAssistant(message, page, language) {
  if (!process.env.OPENROUTER_API_KEY) return null;

  const systemPrompt = buildAssistantSystemPrompt(message, page, language);
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
      temperature: 0.25,
      max_tokens: 900
    })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error?.message || "OpenRouter request failed.");
  }

  const answer = data?.choices?.[0]?.message?.content?.trim();
  if (!answer) throw new Error("OpenRouter returned an empty answer.");
  return answer;
}

function buildLocalAssistantAnswer(message, page, language) {
  const lang = normalizeAssistantLanguage(language);
  const q = normalize(message);

  if (q.includes("buyer matching") || q.includes("matching")) {
    return lang === "en"
      ? "Buyer Matching helps connect farmer produce with buyer requirements such as crop, quantity, location, and offer details."
      : "Buyer Matching farmer ke produce ko buyer requirements se match karne mein help karta hai, jaise crop, quantity, location aur offer details.";
  }

  if (q.includes("demand forecast") || q.includes("forecast")) {
    return lang === "en"
      ? "AI Demand Forecast helps estimate demand direction for the selected crop so the farmer can plan selling."
      : "AI Demand Forecast selected crop ki demand direction samajhne mein help karta hai, jisse farmer selling plan kar sake.";
  }

  if (q.includes("pool") || q.includes("pooling")) {
    return lang === "en"
      ? "Quantity Pooling lets multiple farmers combine quantities to handle a larger buyer requirement."
      : "Quantity Pooling mein multiple farmers apni quantity combine karke larger buyer requirement ko milkar fulfil kar sakte hain.";
  }

  if (q.includes("sell now") || q.includes("selling recommendation")) {
    return lang === "en"
      ? "Selling Recommendation helps compare Sell Now, Wait, and Join Pool using the available market and demand signals."
      : "Selling Recommendation available market aur demand signals ke basis par Sell Now, Wait aur Join Pool options ko samajhne mein help karta hai.";
  }

  if (q.includes("what is this page") || q.includes("ye page") || q.includes("is page")) {
    return lang === "en"
      ? `This is the ${getPageDetails(page)} in Apna Anaj.`
      : `Ye Apna Anaj ka ${getPageDetails(page)} hai.`;
  }

  return lang === "en"
    ? "I am connected to Apna Anaj. You can ask me general questions or ask about a specific app feature."
    : "Main Apna Anaj se connected hoon. Aap general question ya kisi specific app feature ke baare mein pooch sakte ho.";
}

async function generateAssistantAnswer(message, page, language) {
  const errors = [];

  for (const provider of [
    ["openai", callOpenAIWebAssistant],
    ["gemini", callGeminiAssistant],
    ["openrouter", callOpenRouterAssistant]
  ]) {
    try {
      const answer = await provider[1](message, page, language);
      if (answer) return { answer, provider: provider[0] };
    } catch (error) {
      errors.push(`${provider[0]}: ${error?.message || "request failed"}`);
      console.error(`AI provider ${provider[0]} failed:`, error);
    }
  }

  console.warn("AI providers unavailable:", errors.join(" | "));
  return {
    answer: buildLocalAssistantAnswer(message, page, language),
    provider: "local-fallback"
  };
}

app.get("/api/ai-assistant/health", async (req, res) => {
  return res.json({
    success: true,
    configured: Boolean(
      process.env.OPENAI_API_KEY ||
      process.env.GEMINI_API_KEY ||
      process.env.OPENROUTER_API_KEY
    ),
    provider: process.env.OPENAI_API_KEY
      ? "openai-web"
      : (process.env.GEMINI_API_KEY
        ? "gemini"
        : (process.env.OPENROUTER_API_KEY ? "openrouter" : "local-fallback"))
  });
});

app.post("/api/ai-assistant", async (req, res) => {
  try {
    const message = String(req.body?.message || "").trim();
    const page = String(req.body?.page || "unknown").trim();
    const language = normalizeAssistantLanguage(String(req.body?.language || "hi"));

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required."
      });
    }

    const result = await generateAssistantAnswer(message, page, language);

    return res.json({
      success: true,
      answer: result.answer,
      page,
      language,
      provider: result.provider
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
