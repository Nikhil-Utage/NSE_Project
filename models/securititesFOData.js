const mongoose = require("mongoose");
const {
  tradeInfo,
  derivativesData,
  // volumesData,
} = require("./dataModel");

const securitiesSchema = new mongoose.Schema(
  {
    symbol: {
      type: String,
    },
    chart: {
      type: String,
    },
    open: {
      type: Number,
      set: (v) => (isNaN(v) ? null : v),
    },
    dayHigh: {
      type: Number,
      set: (v) => (isNaN(v) ? null : v),
    },
    dayLow: {
      type: Number,
      set: (v) => (isNaN(v) ? null : v),
    },
    previousClose: {
      type: Number,
      set: (v) => (isNaN(v) ? null : v),
    },
    lastPrice: {
      type: Number,
      set: (v) => (isNaN(v) ? null : v),
    },
    change: {
      type: Number,
      set: (v) => (isNaN(v) ? null : v),
    },
    pChange: {
      type: Number,
      set: (v) => (isNaN(v) ? null : v),
    },
    totalTradedVolume: {
      type: Number,
      set: (v) => (isNaN(v) ? null : v),
    },
    totalTradedValue: {
      type: Number,
      set: (v) => (isNaN(v) ? null : v),
    },
    yearHigh: {
      type: Number,
      set: (v) => (isNaN(v) ? null : v),
    },
    yearLow: {
      type: Number,
      set: (v) => (isNaN(v) ? null : v),
    },
    perChange30d: {
      type: Number,
      set: (v) => (isNaN(v) ? null : v),
    },
    perChange365d: {
      type: Number,
      set: (v) => (isNaN(v) ? null : v),
    },
    liveMarketCalculation: {
      type: Number,
      set: (v) => (isNaN(v) ? null : v),
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

module.exports = mongoose.model("securitiesSchema", securitiesSchema);
