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

const AI_CROP_ALIASES = {
  tomato: ["tomato", "tamatar"],
  onion: ["onion", "pyaz", "pyaaz"],
  potato: ["potato", "aloo", "alu"],
  carrot: ["carrot", "gajar"],
  rice: ["rice", "chawal", "paddy", "dhaan"],
  wheat: ["wheat", "gehun", "gehu"],
  maize: ["maize", "corn", "makka", "makkai"],
  gram: ["gram", "chana", "chickpea"],
  peas: ["peas", "matar", "green peas"],
  cauliflower: ["cauliflower", "phool gobhi", "gobhi"],
  cabbage: ["cabbage", "patta gobhi"],
  brinjal: ["brinjal", "baingan", "eggplant"],
  bhindi: ["bhindi", "okra", "ladies finger"],
  cucumber: ["cucumber", "kheera", "cucumbar"],
  capsicum: ["capsicum", "shimla mirch", "bell pepper"],
  spinach: ["spinach", "palak"],
  methi: ["methi", "fenugreek leaves"],
  coriander: ["coriander", "dhaniya", "coriander leaves"],
  garlic: ["garlic", "lahsun", "lehsun"],
  ginger: ["ginger", "adrak"],
  mango: ["mango", "aam"],
  banana: ["banana", "kela"],
  apple: ["apple", "seb"]
};

const AI_CROP_INFO = {
  tomato: "Demand is influenced by season, weather, arrivals, local consumption, perishability, and price movement.",
  onion: "Demand is influenced by household consumption, storage, arrivals, season, weather, and price movement.",
  potato: "Demand is influenced by household use, processing demand, storage, arrivals, season, and prices.",
  carrot: "Demand is influenced by season, local consumption, arrivals, weather, perishability, and prices.",
  rice: "Demand is influenced by food consumption, procurement, season, supply, and market prices.",
  wheat: "Demand is influenced by food consumption, procurement, season, supply, and market prices.",
  maize: "Demand is influenced by food, feed, and industrial use, plus season, supply, and prices.",
  gram: "Demand is influenced by household consumption, dal processing, arrivals, season, and prices.",
  peas: "Demand is strongly seasonal and influenced by weather, arrivals, local consumption, and prices.",
  cauliflower: "Demand is seasonal and influenced by weather, arrivals, local consumption, and prices.",
  cabbage: "Demand is influenced by season, weather, arrivals, local consumption, and prices.",
  brinjal: "Demand is influenced by local consumption, daily arrivals, weather, season, and prices.",
  bhindi: "Demand is influenced by local consumption, season, weather, arrivals, and prices.",
  cucumber: "Demand is influenced by season, weather, local consumption, arrivals, and prices.",
  capsicum: "Demand is influenced by season, weather, restaurant demand, arrivals, and prices.",
  spinach: "Demand is highly perishable and influenced by local consumption, weather, arrivals, and season.",
  methi: "Demand is seasonal and influenced by weather, local consumption, arrivals, and prices.",
  coriander: "Coriander leaves are highly perishable; demand is influenced by daily consumption, weather, arrivals, and season.",
  garlic: "Demand is influenced by household consumption, storage, arrivals, season, and prices.",
  ginger: "Demand is influenced by household consumption, food service demand, season, supply, and prices.",
  mango: "Demand is strongly seasonal and influenced by variety, weather, arrivals, festival demand, and prices.",
  banana: "Demand is relatively regular but still affected by arrivals, season, local consumption, and prices.",
  apple: "Demand is influenced by season, supply, origin, storage availability, local consumption, and prices."
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

function detectAssistantCrop(message) {
  const q = normalize(message).replace(/[^\p{L}\p{N}\s-]/gu, " ");
  for (const [crop, aliases] of Object.entries(AI_CROP_ALIASES)) {
    if (aliases.some((alias) => q.includes(normalize(alias)))) return crop;
  }
  return "";
}

function buildApnaAnajKnowledge() {
  return [
    "Apna Anaj is a farmer-to-buyer agricultural marketplace and decision-support web app.",
    "Its goal is to help farmers understand market signals, plan selling, connect with buyers, pool quantities, and improve visibility of price and logistics information.",
    "Main farmer workflow: Add Produce -> AI Demand Forecast -> Selling Recommendation -> Buyer Matching -> Quantity Pooling -> EV Pickup Route -> Price Transparency -> Orders/Batches.",
    "AI Demand Forecast uses available market/mandi signals shown in the app. In the current implementation, the demand signal is derived from the farmer's expected rate compared with the current government mandi average. The displayed 7-day projection is a modelled reference based on the current mandi range, not a guaranteed future demand value.",
    "Selling Recommendation explains options such as Sell Now, Join Pool, or Review Price using available market signals.",
    "Buyer Matching considers crop, quantity, location, buyer demand, and offered price to explain a match.",
    "Quantity Pooling lets multiple farmers combine produce quantities for larger buyer requirements.",
    "EV Pickup Route represents logistics planning for pickup/delivery using an EV-oriented route concept.",
    "Price Transparency shows price context so the farmer can understand how the offer relates to market information.",
    "Buyer side includes a Fresh Store, basket/cart, orders, and live tracking.",
    "The app supports farmer and buyer registration/login and a multi-language interface.",
    "Never claim a forecast, price, buyer match, or delivery time is guaranteed."
  ].join("\n");
}

function buildAssistantSystemPrompt(message, page, language) {
  const lang = normalizeAssistantLanguage(language);
  return [
    "You are Apna Anaj AI, a helpful conversational assistant embedded in the Apna Anaj website.",
    "Identify the user's actual intent first and answer that question directly.",
    "Do not force unrelated questions into website or page context.",
    "You can answer general farming, agriculture, crop, market, technology, and Apna Anaj questions.",
    "Use the following Apna Anaj product knowledge as the canonical description:",
    buildApnaAnajKnowledge(),
    "For crop demand forecasting, explain HIGH/MEDIUM/LOW in simple farmer-friendly language.",
    "When a user asks for a crop forecast by name, detect the crop. Do not invent a live numerical forecast. Use current app data when supplied; otherwise explain the relevant demand drivers and say that the exact live status requires the current data.",
    "For factual or changing questions, use available current data or web search when available. Never invent current prices, government data, private account data, orders, or live events.",
    "Use simple words and practical explanations. Avoid generic filler and repetitive page descriptions.",
    "Language rule: English selected = answer in English. Hindi selected = answer in natural Devanagari Hindi. Hinglish selected = answer in natural Roman Hindi.",
    "Selected language: " + (AI_LANGUAGE_NAMES[lang] || "Hindi"),
    "Current page: " + getPageDetails(page),
    "Detected crop: " + (detectAssistantCrop(message) || "none"),
    "User question: " + message
  ].join("\n");
}

async function callOpenAIWebAssistant(message, page, language) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const model = process.env.OPENAI_MODEL || "gpt-5";
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

  const parts = Array.isArray(data?.output)
    ? data.output.flatMap((item) => Array.isArray(item?.content) ? item.content : [])
    : [];

  const answer =
    String(data?.output_text || "").trim() ||
    parts.map((item) => String(item?.text || "")).join("").trim();

  if (!answer) throw new Error("OpenAI returned an empty answer.");
  return answer;
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
  const crop = detectAssistantCrop(message);

  const websiteEN = "Apna Anaj is a farmer-to-buyer agricultural platform with crop listing, market and demand signals, selling guidance, buyer matching, quantity pooling, EV pickup planning, price transparency, orders and buyer tracking.";
  const websiteHI = "Apna Anaj ek farmer-to-buyer agricultural platform hai. Isme crop listing, market aur demand signals, selling guidance, buyer matching, quantity pooling, EV pickup planning, price transparency, orders aur buyer tracking jaise features hain.";

  const isForecast = q.includes("demand") && (
    q.includes("forecast") || q.includes("prediction") || q.includes("future") ||
    q.includes("kaise") || q.includes("how") || q.includes("hoga") || q.includes("hogī")
  ) || q.includes("demand forecast") || q.includes("demand forecasting");

  if (q.includes("what is apna anaj") || q.includes("apna anaj kya") || q.includes("website kya") || q.includes("app kya")) {
    return lang === "en" ? websiteEN : websiteHI;
  }

  if (isForecast && crop) {
    const cropName = crop.charAt(0).toUpperCase() + crop.slice(1);
    const info = AI_CROP_INFO[crop] || "season, weather, arrivals, local consumption, supply, and prices.";
    if (lang === "en") {
      return cropName + " demand forecasting uses the available market signals for " + cropName + " and classifies the signal as HIGH, MEDIUM, or LOW. Important demand drivers are " + info + " The exact live result should come from current app data, so I will not invent a live value.";
    }
    return cropName + " ki demand forecasting available market signals ko dekhkar HIGH, MEDIUM ya LOW demand signal samajhti hai. Is crop ke important factors hain: " + info + " Exact live result current app data se hi bataya jana chahiye, isliye fake number nahi diya jayega.";
  }

  if (isForecast) {
    return lang === "en"
      ? "Apna Anaj demand forecasting uses available crop and market signals to give a HIGH, MEDIUM, or LOW demand signal. It helps farmers plan selling and market access; it is a decision-support signal, not a guaranteed future outcome."
      : "Apna Anaj demand forecasting available crop aur market signals ke basis par HIGH, MEDIUM ya LOW demand signal deti hai. Isse farmer ko selling aur market planning me help milti hai; ye guaranteed future result nahi hai.";
  }

  if (q.includes("buyer matching") || q.includes("matching")) {
    return lang === "en"
      ? "Buyer Matching connects farmer produce with buyer requirements using crop, quantity, location, buyer demand, and offered price."
      : "Buyer Matching farmer ke produce ko buyer ki requirement se connect karta hai, jisme crop, quantity, location, buyer demand aur offered price dekhe jate hain.";
  }

  if (q.includes("quantity pooling") || q.includes("pooling") || q.includes("pool kaise")) {
    return lang === "en"
      ? "Quantity Pooling lets multiple farmers combine their produce quantities so a larger buyer requirement can be fulfilled together."
      : "Quantity Pooling me multiple farmers apni produce quantity combine karte hain, jisse badi buyer requirement ko milkar fulfil kiya ja sakta hai.";
  }

  if (q.includes("selling recommendation") || q.includes("sell now") || q.includes("kab bechu") || q.includes("wait")) {
    return lang === "en"
      ? "Selling Recommendation explains options such as Sell Now, Join Pool, or Review Price using the available market signals."
      : "Selling Recommendation available market signals ke basis par Sell Now, Join Pool ya Review Price jaise options ko samjhata hai.";
  }

  if (q.includes("ev pickup") || q.includes("pickup route") || q.includes("delivery route")) {
    return lang === "en"
      ? "EV Pickup Route is the logistics step for planning pickup movement from farmers toward buyers using an EV-oriented route concept."
      : "EV Pickup Route farmer se buyer tak pickup movement ko EV-oriented route concept ke through plan karne wala logistics step hai.";
  }

  if (q.includes("price transparency") || q.includes("transparent price") || q.includes("price kaise")) {
    return lang === "en"
      ? "Price Transparency helps a farmer understand an offer in relation to available market-price information."
      : "Price Transparency farmer ko available market-price information ke comparison me offer ko samajhne me help karta hai.";
  }

  if (q.includes("benefit") || q.includes("advantages") || q.includes("fayda")) {
    return lang === "en"
      ? "For farmers, Apna Anaj can help with market awareness, selling decisions, buyer discovery, quantity pooling, and clearer price and logistics information."
      : "Farmer ke liye Apna Anaj market awareness, selling decision, buyer discovery, quantity pooling aur price/logistics ki clearer information me help kar sakta hai.";
  }

  if (q.includes("what is this page") || q.includes("ye page") || q.includes("is page")) {
    return lang === "en"
      ? "This is the " + getPageDetails(page) + " in Apna Anaj."
      : "Ye Apna Anaj ka " + getPageDetails(page) + " hai.";
  }

  return lang === "en"
    ? "You can ask me about Apna Anaj, demand forecasting, any crop, selling, buyer matching, quantity pooling, market concepts, or general farming."
    : "Aap mujhse Apna Anaj, demand forecasting, kisi bhi crop, selling, buyer matching, quantity pooling, market concepts ya general farming ke baare me pooch sakte ho.";
}

async function generateAssistantAnswer(message, page, language) {
  const errors = [];

  for (const [providerName, providerCall] of [
    ["gemini", callGeminiAssistant],
    ["openai", callOpenAIWebAssistant],
    ["openrouter", callOpenRouterAssistant]
  ]) {
    try {
      const answer = await providerCall(message, page, language);
      if (answer) return { answer, provider: providerName };
    } catch (error) {
      errors.push(String(providerName) + ": " + (error?.message || "request failed"));
      console.error("AI provider " + providerName + " failed:", error);
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
