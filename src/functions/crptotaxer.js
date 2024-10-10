const { app } = require("@azure/functions");

const mongoose = require("mongoose");
const axios = require("axios");

const CryptoPriceSchema = new mongoose.Schema({
  coinId: String,
  name: String,
  current_price_usd: Number,
  market_cap_usd: Number,
  price_change_24h: Number,
  timestamp: { type: Date, default: Date.now },
});

let CryptoPrice;
try {
  CryptoPrice = mongoose.model("CryptoPrice");
} catch {
  CryptoPrice = mongoose.model("CryptoPrice", CryptoPriceSchema);
}

app.timer("crptotaxer", {
  schedule: "0 0 */2 * * *",
  handler: async (myTimer, context) => {
    context.log("Timer function processed request.");
    const timeStamp = new Date().toISOString();

    if (mongoose.connection.readyState !== 1) {
      try {
        await mongoose.connect(process.env.MONGODB_URI);
        context.log("MongoDB connected successfully");
      } catch (error) {
        context.log.error("MongoDB connection error:", error);
        return;
      }
    }

    try {
      const coins = ["bitcoin", "matic-network", "ethereum"];
      const response = await axios.get(
        "https://api.coingecko.com/api/v3/coins/markets",
        {
          params: {
            vs_currency: "usd",
            ids: coins.join(","),
            order: "market_cap_desc",
          },
          headers: {
            "Content-Type": "application/json",
            "x-cg-demo-api-key": process.env.COINGECKO_API_KEY,
          },
        }
      );

      for (const coin of response.data) {
        await CryptoPrice.create({
          coinId: coin.id,
          name: coin.name,
          current_price_usd: coin.current_price,
          market_cap_usd: coin.market_cap,
          price_change_24h: coin.price_change_24h,
        });
      }

      context.log("Crypto data updated successfully at:", timeStamp);
    } catch (error) {
      context.log.error("Error processing crypto data:", error);
    } finally {
      await mongoose.connection.syncIndexes();
    }
  },
});
