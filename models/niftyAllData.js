const mongoose = require("mongoose");
const { tradeInfo } = require("./dataModel");

const calculatedData = new mongoose.Schema({
  totalBuyAnd4Buy: {
    type: Number,
    required:true
  },
  totalSellAnd4Sell: {
    type: Number,
    required:true
  },
  totalBuyVsTotalSell: {
    type: Number,
    required:true
  },
  sum4SellVssum4Buy: {
    type: Number,
    set: (v) => (isNaN(v) ? 0 : v),
    required:true
  },
  totalSellAndSum4SellVstotalBuyAndSum4Buy: {
    type: Number,
    required:true
  },
  // uVsT: {
  //   type: Number,
  //   required:true
  // },
  // sCrossV: {
  //   type: Number,
  //   required:true
  // },
});

const niftyAllSchema = new mongoose.Schema(
  {
    symbol: {
      type: String,
      required: true,
      unique: false,
    },
    chart: {
      type: String,
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
    previousClose: {
      type: Number,
    },
    finalQuantity: {
      type: Number,
    },
    totalTurnover: {
      type: Number,
    },
    yearHigh: {
      type: Number,
    },
    yearLow: {
      type: Number,
    },
    iep: {
      type: Number,
    },
    totalBuyQuantity: {
      type: Number,
    },
    totalSellQuantity: {
      type: Number,
    },
    atoBuyQty: {
      type: Number,
    },
    atoSellQty: {
      type: Number,
    },
    sum4rowBuyQty: {
      type: Number,
    },
    sum4rowSellQty: {
      type: Number,
    },
    atoPrice: {
      type: Number,
    },
    calculated:{
      type:Number
    },
    additionValue:{
      type:Number
    },
    subtractedValue:{
      type:Number
    },
    calculatedData: {
      type: calculatedData,
    },
    // tradeInfo: {
    //   type: tradeInfo,
    // },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("niftyAllSchema", niftyAllSchema);
