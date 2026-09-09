import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    "http://localhost:3000"
  );

  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  next();
});

const PORT = process.env.PORT || 5000;

const DATA_GOV_API_KEY =
  process.env.DATA_GOV_API_KEY;

const RESOURCE_ID =
  "9ef84268-d588-465a-a308-a864a43d0070";

const API_URL =
  `https://api.data.gov.in/resource/${RESOURCE_ID}`;


// =====================================
// CROP ALIASES
// =====================================

const CROP_ALIASES = {
  wheat: [
    "Wheat",
    "Gehu"
  ],

  rice: [
    "Rice",
    "Paddy(Common)"
  ],

  gram: [
    "Bengal Gram(Gram)(Whole)"
  ],

  bajra: [
    "Bajra(Pearl Millet/Cumbu)"
  ],

  tomato: [
    "Tomato"
  ],

  onion: [
    "Onion"
  ],

  potato: [
    "Potato"
  ],

  bhindi: [
    "Bhindi(Ladies Finger)"
  ],

  carrot: [
    "Carrot"
  ],

  peas: [
    "Green Peas"
  ],

  capsicum: [
    "Capsicum"
  ],

  "bottle gourd": [
    "Bottle gourd"
  ],

  brinjal: [
    "Brinjal"
  ],

  cucumber: [
    "Cucumbar(Kheera)"
  ],

  cauliflower: [
    "Cauliflower"
  ],

  spinach: [
    "Spinach"
  ],

  methi: [
    "Methi"
  ],

  coriander: [
    "Coriander(Leaves)"
  ],

  mango: [
    "Mango"
  ],

  milk: [
    "Milk"
  ]
};


// =====================================
// DEMO FALLBACK
// =====================================

const DEMO_MARKET_DATA = {
  milk: {
    average: 44,
    lowest: 40,
    highest: 48
  }
};


// =====================================
// NORMALIZE
// =====================================

function normalize(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}


// =====================================
// GET CROP NAMES
// =====================================

function getCropNames(crop) {
  const key = normalize(crop);

  return (
    CROP_ALIASES[key] || [crop]
  );
}


// =====================================
// GET FIELD VALUE
// =====================================

function getField(row, names) {

  for (const name of names) {

    if (
      row[name] !== undefined &&
      row[name] !== null
    ) {
      return row[name];
    }

  }

  return "";
}


// =====================================
// FETCH GOVERNMENT DATA
// =====================================

async function fetchGovernmentData(crop) {

  if (!DATA_GOV_API_KEY) {
    throw new Error(
      "DATA_GOV_API_KEY missing in .env"
    );
  }

  const cropNames =
    getCropNames(crop);

  let allRecords = [];


  for (const cropName of cropNames) {

    const params =
      new URLSearchParams({

        "api-key":
          DATA_GOV_API_KEY,

        format:
          "json",

        limit:
          "10000",

        "filters[commodity]":
          cropName

      });


    const url =
      `${API_URL}?${params.toString()}`;


    const response =
      await fetch(url);


    if (!response.ok) {

      throw new Error(
        `Government API error: ${response.status}`
      );

    }


    const result =
      await response.json();


    if (
      Array.isArray(result.records)
    ) {

      allRecords =
        allRecords.concat(
          result.records
        );

    }

  }


  // Remove duplicate records

  const uniqueRecords =
    Array.from(
      new Map(
        allRecords.map(
          (row, index) => [
            JSON.stringify(row),
            row
          ]
        )
      ).values()
    );


  return uniqueRecords;
}


// =====================================
// FORMAT GOVERNMENT DATA
// =====================================

function formatMarketData(records) {

  return records.map((row) => {

    const minPrice =
      Number(
        getField(row, [
          "min_price",
          "Min_x0020_Price",
          "Min Price"
        ])
      ) || 0;


    const maxPrice =
      Number(
        getField(row, [
          "max_price",
          "Max_x0020_Price",
          "Max Price"
        ])
      ) || 0;


    const modalPrice =
      Number(
        getField(row, [
          "modal_price",
          "Modal_x0020_Price",
          "Modal Price"
        ])
      ) || 0;


    return {

      state:
        getField(row, [
          "state",
          "State"
        ]),

      district:
        getField(row, [
          "district",
          "District"
        ]),

      market:
        getField(row, [
          "market",
          "Market"
        ]),

      commodity:
        getField(row, [
          "commodity",
          "Commodity"
        ]),

      variety:
        getField(row, [
          "variety",
          "Variety"
        ]),

      grade:
        getField(row, [
          "grade",
          "Grade"
        ]),

      arrivalDate:
        getField(row, [
          "arrival_date",
          "Arrival_Date",
          "Arrival Date"
        ]),


      // Government price
      // ₹/Quintal

      minPrice,

      maxPrice,

      modalPrice,


      // ₹/KG

      minPricePerKg:
        Number(
          (minPrice / 100)
            .toFixed(2)
        ),

      maxPricePerKg:
        Number(
          (maxPrice / 100)
            .toFixed(2)
        ),

      modalPricePerKg:
        Number(
          (modalPrice / 100)
            .toFixed(2)
        )

    };

  });

}


// =====================================
// TEST API
// =====================================

app.get(
  "/api/test",
  (req, res) => {

    res.json({

      success: true,

      message:
        "ApnaAnaj backend is working!",

      governmentAPI:
        Boolean(
          DATA_GOV_API_KEY
        )

    });

  }
);


// =====================================
// MARKET DATA
// =====================================

app.get(
  "/api/market-data",
  async (req, res) => {

    try {

      const crop =
        normalize(
          req.query.crop ||
          "Tomato"
        );


      const records =
        await fetchGovernmentData(
          crop
        );


      // Government data found

      if (
        records.length > 0
      ) {

        const marketData =
          formatMarketData(
            records
          );


        return res.json({

          success: true,

          availableData: true,

          isDemoData: false,

          source:
            "Government of India - AGMARKNET",

          sourceType:
            "Live Government API",

          priceUnit:
            "₹/Quintal",

          convertedPriceUnit:
            "₹/KG",

          crop,

          records:
            marketData.length,

          data:
            marketData

        });

      }


      // =================================
      // DEMO FALLBACK
      // =================================

      if (
        DEMO_MARKET_DATA[crop]
      ) {

        const demo =
          DEMO_MARKET_DATA[crop];


        return res.json({

          success: true,

          availableData: true,

          isDemoData: true,

          source:
            "ApnaAnaj Demo Reference Data",

          crop,

          records: 1,

          data: [

            {

              state:
                "Demo",

              district:
                "Demo",

              market:
                "ApnaAnaj Demo Market",

              commodity:
                crop,

              variety:
                "Demo",

              grade:
                "Demo",

              arrivalDate:
                new Date()
                  .toISOString()
                  .split("T")[0],

              minPrice:
                demo.lowest,

              maxPrice:
                demo.highest,

              modalPrice:
                demo.average,

              minPricePerKg:
                demo.lowest,

              maxPricePerKg:
                demo.highest,

              modalPricePerKg:
                demo.average

            }

          ]

        });

      }


      // No data

      return res.json({

        success: false,

        availableData: false,

        isDemoData: false,

        crop,

        records: 0,

        message:
          "No government mandi data found for this crop."

      });

    }

    catch (error) {

      console.error(
        "Market data error:",
        error
      );


      res.status(500).json({

        success: false,

        error:
          error.message

      });

    }

  }
);


// =====================================
// MARKET SUMMARY
// =====================================

app.get(
  "/api/market-summary",
  async (req, res) => {

    try {

      const crop =
        normalize(
          req.query.crop ||
          "Tomato"
        );


      const records =
        await fetchGovernmentData(
          crop
        );


      // =================================
      // GOVERNMENT DATA
      // =================================

      if (
        records.length > 0
      ) {

        const marketData =
          formatMarketData(
            records
          );


        const prices =
         marketData
          .map(
           (row) =>
            Number(row.modalPrice)
           )
          .filter(
           (price) =>
            Number.isFinite(price) &&
            price >= 100
         );


        if (
          prices.length > 0
        ) {

          const average =
            prices.reduce(
              (sum, price) =>
                sum + price,
              0
            ) / prices.length;


          const lowest =
            Math.min(
              ...prices
            );


          const highest =
            Math.max(
              ...prices
            );


          const markets =
            new Set(
              marketData
                .map(
                  (row) =>
                    row.market
                )
                .filter(Boolean)
            );


          return res.json({

            success: true,

            availableData: true,

            isDemoData: false,

            source:
              "Government of India - AGMARKNET",

            sourceType:
              "Live Government API",

            crop,

            markets:
              markets.size,

            records:
              prices.length,

            priceUnit:
              "₹/Quintal",

            averageModalPrice:
              Math.round(
                average
              ),

            lowestModalPrice:
              lowest,

            highestModalPrice:
              highest,

            priceUnitPerKg:
              "₹/KG",

            averageModalPricePerKg:
              Number(
                (
                  average / 100
                ).toFixed(2)
              ),

            lowestModalPricePerKg:
              Number(
                (
                  lowest / 100
                ).toFixed(2)
              ),

            highestModalPricePerKg:
              Number(
                (
                  highest / 100
                ).toFixed(2)
              )

          });

        }

      }


      // =================================
      // DEMO FALLBACK
      // =================================

      if (
        DEMO_MARKET_DATA[crop]
      ) {

        const demo =
          DEMO_MARKET_DATA[crop];


        return res.json({

          success: true,

          availableData: true,

          isDemoData: true,

          source:
            "ApnaAnaj Demo Reference Data",

          sourceType:
            "Demo",

          crop,

          markets: 0,

          records: 1,

          priceUnit:
            "₹/KG",

          averageModalPricePerKg:
            demo.average,

          lowestModalPricePerKg:
            demo.lowest,

          highestModalPricePerKg:
            demo.highest

        });

      }


      // =================================
      // NO DATA
      // =================================

      return res.json({

        success: false,

        availableData: false,

        isDemoData: false,

        crop,

        markets: 0,

        records: 0,

        message:
          "No government mandi price data found for this crop."

      });

    }

    catch (error) {

      console.error(
        "Market summary error:",
        error
      );


      res.status(500).json({

        success: false,

        error:
          error.message

      });

    }

  }
);


// =====================================
// PRICE COMPARISON
// =====================================

// =====================================
// PRICE COMPARISON
// =====================================

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
        url.searchParams.set("limit", "10000");

        url.searchParams.set(
          "filters[commodity]",
          cropName
        );

        url.searchParams.set(
          "filters[arrival_date]",
          date
        );

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
          allRecords.map((row) => [
            JSON.stringify(row),
            row
          ])
        ).values()
      );
    }

    const currentRecords =
      await fetchPriceByDate(currentDate);

    const lastMonthRecords =
      await fetchPriceByDate(lastMonthDate);

    function getAveragePrice(records) {
      const formatted =
        formatMarketData(records);

      const prices = formatted
        .map((item) =>
          Number(item.modalPrice)
        )
        .filter(
          (price) =>
            Number.isFinite(price) &&
            price >= 100
        );

      if (!prices.length) {
        return null;
      }

      return Number(
        (
          prices.reduce(
            (sum, price) =>
              sum + price,
            0
          ) /
          prices.length /
          100
        ).toFixed(2)
      );
    }

    const currentPricePerKg =
      getAveragePrice(
        currentRecords
      );

    const lastMonthPricePerKg =
      getAveragePrice(
        lastMonthRecords
      );

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
        (
          (
            currentPricePerKg -
            lastMonthPricePerKg
          ) /
          lastMonthPricePerKg
        ) * 100
      ).toFixed(2)
    );

    let priceLevel = "MEDIUM";

    if (changePercent >= 10) {
      priceLevel = "HIGH";
    } else if (changePercent <= -10) {
      priceLevel = "LOW";
    }

    res.json({
      success: true,
      availableData: true,
      isDemoData: false,

      source:
        "Government of India - AGMARKNET",

      sourceType:
        "Government Daily Mandi Data",

      crop,

      currentDate,
      lastMonthDate,

      currentPricePerKg,
      lastMonthPricePerKg,

      changePercent,
      priceLevel
    });

  } catch (error) {

    console.error(
      "Price comparison error:",
      error.message
    );

    res.status(500).json({
      success: false,
      availableData: false,
      isDemoData: false,
      message: error.message
    });
  }
});


// =====================================
// START SERVER
// =====================================

app.listen(
  PORT,
  "0.0.0.0",
  () => {

    console.log(
      `Backend running on http://localhost:${PORT}`
    );

    console.log(
      `Government API: ${
        DATA_GOV_API_KEY
          ? "CONNECTED"
          : "NOT CONNECTED"
      }`
    );

  }
);