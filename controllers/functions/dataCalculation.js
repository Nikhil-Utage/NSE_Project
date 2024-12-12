const preOpenDataCalculation = async (item) => {
  const { detail } = item;
  const preOpen = detail.preOpenMarket.preopen;

  const atoBuyQty = detail.atoBuyQty;
  const first4BuyQty = preOpen.reduce((acc, obj) => acc + obj.buyQty, 0);
  const atoBuyAnd4Buy = atoBuyQty + first4BuyQty;

  const atoSellQty = detail.atoSellQty;
  const first4SellQty = preOpen
    .slice(0, 4)
    .reduce((acc, obj) => acc + obj.sellQty, 0);
  const atoSellAnd4Sell = atoSellQty + first4SellQty;

  const totalBuyQuantity = detail.preOpenMarket.totalBuyQuantity;
  const totalSellQuantity = detail.preOpenMarket.totalSellQuantity;
  const totalBuyVsTotalSell = totalSellQuantity / totalBuyQuantity;

  const sum4Sell = preOpen
    .slice(0, 4)
    .reduce((acc, obj) => acc + obj.sellQty, 0);
  const sum4Buy = preOpen.reduce((acc, obj) => acc + obj.buyQty, 0);
  const sum4SellVsSum4Buy = sum4Sell / sum4Buy;

  const atoSellVsAtoBuy = atoSellQty / atoBuyQty;

  const uVsT = atoSellAnd4Sell / atoBuyAnd4Buy;

  const iepPrice = preOpen.find((obj) => obj.iep).price;
  const sCrossV = iepPrice * totalBuyVsTotalSell;

  item.calculated = {
    atoBuyAnd4Buy,
    atoSellAnd4Sell,
    totalBuyVsTotalSell,
    sum4SellVsSum4Buy,
    atoSellVsAtoBuy,
    uVsT,
    sCrossV,
  };

  return item;
};

function addCalculatedFieldsForPreOpenMarket(data) {
  const { preOpenMarket, priceInfo } = data;

  const atoBuyQty = preOpenMarket?.ato?.buy || 0;
  const atoSellQty = preOpenMarket?.ato?.sell || 0;
  const totalBuyQuantity = preOpenMarket?.totalBuyQuantity || 0;
  const totalSellQuantity = preOpenMarket?.totalSellQuantity || 0;

  const first4BuyQty =
    preOpenMarket?.preopen?.map((item) => item.buyQty || 0) || [];
  const first4SellQty =
    preOpenMarket?.preopen?.slice(0, 4).map((item) => item.sellQty || 0) || [];

  const sumFirst4Buy = first4BuyQty.reduce((acc, qty) => acc + qty, 0);
  const sumFirst4Sell = first4SellQty.reduce((acc, qty) => acc + qty, 0);

  const atoBuyAnd4Buy = atoBuyQty + sumFirst4Buy;
  const atoSellAnd4Sell = atoSellQty + sumFirst4Sell;

  const totalBuyVsTotalSell =
    totalBuyQuantity !== 0 ? totalSellQuantity / totalBuyQuantity : 0;
  const sum4SellVssum4Buy =
    sumFirst4Buy !== 0 ? sumFirst4Sell / sumFirst4Buy : 0;
  const atoSellVsAtoBuy = atoBuyQty !== 0 ? atoSellQty / atoBuyQty : 0;
  const uVsT = atoBuyAnd4Buy !== 0 ? atoSellAnd4Sell / atoBuyAnd4Buy : 0;

  const iepPrice = preOpenMarket?.preopen?.find((item) => item.iep)?.price || 0;
  const sCrossV = iepPrice * totalBuyVsTotalSell;

  const calculatedperChange =
    ((preOpenMarket.IEP - priceInfo.weekHighLow.max) * 100) /
    priceInfo.weekHighLow.max;
  data.calculated = {
    atoBuyAnd4Buy,
    atoSellAnd4Sell,
    totalBuyVsTotalSell,
    sum4SellVssum4Buy,
    atoSellVsAtoBuy,
    uVsT,
    sCrossV,
    calculatedperChange,
  };

  return data;
}

function calculatePriceChange(obj) {
  const { lastPrice, yearHigh } = obj;
  if (yearHigh !== 0) {
    return (100 * (lastPrice - yearHigh)) / yearHigh;
  } else {
    return 0;
  }
}

module.exports = {
  preOpenDataCalculation,
  calculatePriceChange,
  addCalculatedFieldsForPreOpenMarket,
};
