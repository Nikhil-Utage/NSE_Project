const mongoose = require("mongoose");
const {
  tradeInfo,
  // oiSpurtsData,
  // preOpenMarket,
  derivativesData,
  // volumesData,
} = require("./dataModel");

const niftyBankSchema = new mongoose.Schema(
  {
    priority: {
      type: Number,
    },
    symbol: {
      type: String,
    },
    chart: {
      type: String,
    },
    open: {
      type: Number,
    },
    dayHigh: {
      type: Number,
    },
    dayLow: {
      type: Number,
    },
    previousClose: {
      type: Number,
    },
    lastPrice: {
      type: Number,
    },
    change: {
      type: Number,
    },
    pChange: {
      type: Number,
    },
    totalTradedVolume: {
      type: Number,
    },
    totalTradedValue: {
      type: Number,
    },
    yearHigh: {
      type: Number,
    },
    yearLow: {
      type: Number,
    },
    perChange30d: {
      type: Number,
    },
    perChange365d: {
      type: Number,
    },
    liveMarketCalculation: {
      type: Number,
    },
    totalSellVsTotalBuy:{
      type: Number,
      set: (v) => (isNaN(v) ? null : v),
    },
    derivativesData: {
      type: derivativesData,
    },
    tradeInfo: {
      type: tradeInfo,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("niftyBankSchema", niftyBankSchema);
