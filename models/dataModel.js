const mongoose = require("mongoose");

const calculatedData = new mongoose.Schema({
  atoBuyAnd4Buy: {
    type: Number,
    set: (v) => (isNaN(v) ? null : v),
    required:true
  },
  atoSellAnd4Sell: {
    type: Number,
    set: (v) => (isNaN(v) ? null : v),
    required:true
  },
  totalBuyVsTotalSell: {
    type: Number,
    set: (v) => (isNaN(v) ? null : v),
    required:true
  },
  sum4SellVssum4Buy: {
    type: Number,
    set: (v) => (isNaN(v) ? 0 : v),
    required:true
  },
  atoSellVsAtoBuy: {
    type: Number,
    set: (v) => (isNaN(v) ? null : v),
    required:true
  },
  uVsT: {
    type: Number,
    set: (v) => (isNaN(v) ? null : v),
    required:true
  },
  sCrossV: {
    type: Number,
    set: (v) => (isNaN(v) ? null : v),
    required:true
  },
});

const preOpenMarket = new mongoose.Schema({
  prevClose: {
    type: Number,
    set: (v) => (isNaN(v) ? null : v),
    required:true
  },
  iep: {
    type: Number,
    set: (v) => (isNaN(v) ? null : v),
    required:true
  },
  change: {
    type: Number,
    set: (v) => (isNaN(v) ? null : v),
    required:true
  },
  perChange: {
    type: Number,
    set: (v) => (isNaN(v) ? null : v),
    required:true
  },
  final: {
    type: Number,
    set: (v) => (isNaN(v) ? null : v),
    required:true
  },
  finalQty: {
    type: Number,
    set: (v) => (isNaN(v) ? null : v),
    required:true
  },
  yearHigh: {
    type: Number,
    set: (v) => (isNaN(v) ? null : v),
    required:true
  },
  yearHighDate: {
    type: String,
    required:true
  },
  yearLowDate: {
    type: String,
    required:true
  },
  yearLow: {
    type: Number,
    set: (v) => (isNaN(v) ? null : v),
    required:true
  },
  calculation: {
    type: Number,
    set: (v) => (isNaN(v) ? null : v),
    required:true
  },
  totalBuyQuantity: {
    type: Number,
    set: (v) => (isNaN(v) ? null : v),
    required:true
  },
  totalSellQuantity: {
    type: Number,
    set: (v) => (isNaN(v) ? null : v),
    required:true
  },
  atoBuyQty: {
    type: Number,
    set: (v) => (isNaN(v) ? null : v),
    required:true
  },
  atoSellQty: {
    type: Number,
    set: (v) => (isNaN(v) ? null : v),
    required:true
  },
  sum4rowBuyQty: {
    type: Number,
    set: (v) => (isNaN(v) ? null : v),
    required:true
  },
  sum4rowSellQty: {
    type: Number,
    set: (v) => (isNaN(v) ? null : v),
    required:true
  },
  atoPrice: {
    type: Number,
    set: (v) => (isNaN(v) ? null : v),
    required:true
  },
  calculatedData: {
    type: calculatedData,
  },
});

const oiSpurtsData = new mongoose.Schema({
  perChnageinOI: {
    type: Number,
    set: (v) => (isNaN(v) ? null : v),
    required:true
  },
  volume: {
    type: Number,
    set: (v) => (isNaN(v) ? null : v),
    required:true
  },
  value: {
    type: Number,
    set: (v) => (isNaN(v) ? null : v),
    required:true
  },
  optionsValue: {
    type: Number,
    set: (v) => (isNaN(v) ? null : v),
    required:true
  },
  totalValue: {
    type: Number,
    set: (v) => (isNaN(v) ? null : v),
    required:true
  },
});

const stockFuturesModel = new mongoose.Schema({
  totalBuyQuantity: {
    type: Number,
    set: (v) => (isNaN(v) ? null : v),
    required:true
  },
  totalSellQuantity: {
    type: Number,
    set: (v) => (isNaN(v) ? null : v),
    required:true
  },
  calculated: {
    type: Number,
    set: (v) => (isNaN(v) ? null : v),
    required:true
  },
});

const stockOptionsModel = new mongoose.Schema({
  totalBuyQuantity: {
    type: Number,
    set: (v) => (isNaN(v) ? null : v),
    required:true
  },
  totalSellQuantity: {
    type: Number,
    set: (v) => (isNaN(v) ? null : v),
    required:true
  },
  optionType: {
    type: String,
    required:true
  },
  strikePrice: {
    type: Number,
    set: (v) => (isNaN(v) ? null : v),
    required:true
  },
  calculated: {
    type: Number,
    set: (v) => (isNaN(v) ? null : v),
    required:true
  },
});

const derivativesData = new mongoose.Schema({
  finalFuturesData: {
    type: [stockFuturesModel],
  },
  finalOptionsData: {
    type: stockOptionsModel,
  },
});

const tradeInfo = new mongoose.Schema({
  orderBookBuyQty: {
    type: Number,
    set: (v) => (isNaN(v) ? null : v),
    required:true
  },
  ordrtBookSelQty: {
    type: Number,
    set: (v) => (isNaN(v) ? null : v),
    required:true
  },
  ratio: {
    type: Number,
    set: (v) => (isNaN(v) ? null : v),
    required:true
  },
  // totalTradedValue: {
  //   type: Number,
  //   set: (v) => (isNaN(v) ? null : v),
  //   required:true
  // },
  // totalMarketCap: {
  //   type: Number,
  //   set: (v) => (isNaN(v) ? null : v),
  //   required:true
  // },
  // deliverableVsTradedQty: {
  //   type: Number,
  //   set: (v) => (isNaN(v) ? null : v),
  //   required:true
  // },
  // dailyVolatility: {
  //   type: Number,
  //   set: (v) => (isNaN(v) ? null : v),
  //   required:true
  // },
  // annualisedVolatility: {
  //   type: Number,
  //   set: (v) => (isNaN(v) ? null : v),
  //   required:true
  // },
  // calculated: {
  //   type: {
  //     diffOfHighAndLowDates: {
  //       type: String,
  //       set: (v) => (v === "-" ? null : v),
  //     },
  //     diffOfCurrentAndyearHighDate: {
  //       type: String,
  //       set: (v) => (v === "-" ? null : v),
  //     },
  //   },
  // },
});

const volumesData = new mongoose.Schema({
  tradedVolume: {
    type: Number,
    set: (v) => (isNaN(v) ? 0 : v),
    required:true
  },
  avgOfVolumes: {
    type: Number,
    set: (v) => (isNaN(v) ? 0 : v),
    required:true
  },
  calculated: {
    type: Number,
    set: (v) => (isNaN(v) ? 0 : v),
    required:true
  },
});

module.exports = {
  tradeInfo,
  preOpenMarket,
  oiSpurtsData,
  derivativesData,
  volumesData,
};
