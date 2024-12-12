const mongoose = require("mongoose");
const {
  tradeInfo,
  // preOpenMarket,
  // volumesData,
} = require("./dataModel");

const nifty500Schema = new mongoose.Schema(
  {
    priority:{
      type:Number
    },
    symbol: {
      type: String,
    },
    chart: {
      type: String,
    },
    open: {
      type: Number,
      set: (v) => (v === "-" ? null : v),
    },
    dayHigh: {
      type: Number,
      set: (v) => (v === "-" ? null : v),
    },
    dayLow: {
      type: Number,
      set: (v) => (v === "-" ? null : v),
    },
    previousClose: {
      type: Number,
      set: (v) => (v === "-" ? null : v),
    },
    lastPrice: {
      type: Number,
      set: (v) => (v === "-" ? null : v),
    },
    change: {
      type: Number,
      set: (v) => (v === "-" ? null : v),
    },
    pChange: {
      type: Number,
      set: (v) => (v === "-" ? null : v),
    },
    totalTradedVolume: {
      type: Number,
      set: (v) => (v === "-" ? null : v),
    },
    totalTradedValue: {
      type: Number,
      set: (v) => (v === "-" ? null : v),
    },
    yearHigh: {
      type: Number,
      set: (v) => (v === "-" ? null : v),
    },
    yearLow: {
      type: Number,
      set: (v) => (v === "-" ? null : v),
    },
    perChange30d: {
      type: Number,
      set: (v) => (v === "-" ? null : v),
    },
    perChange365d: {
      type: Number,
      set: (v) => (v === "-" ? null : v),
    },
    liveMarketCalculation: {
      type: Number,
      set: (v) => (v === "-" ? null : v),
    },
    tradeInfo: {
      type: tradeInfo,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("nifty500Schema", nifty500Schema);
