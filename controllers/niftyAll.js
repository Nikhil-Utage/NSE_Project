const { tradeInfo } = require("../models/dataModel.js");
const niftyAllData = require("../models/niftyAllData.js");
const { getCookies } = require("./functions/cookies.js");
const fetchLiveMarketData = require("./functions/fetchLiveMarketData.js");
const { client, jar, proxyOptions } = require("./functions/httpClient.js");

require("dotenv").config();

const fetchAndStoreNiftyAllData = async () => {
  try {
    const cookies = await getCookies();
    console.log(cookies);
    const secondResponse = await client.get(process.env.NIFTY_ALL_URL, {
      ...proxyOptions,
      headers: {
        authority: "www.nseindia.com",
        method: "GET",
        path: "/api/market-data-pre-open?key=ALL",
        scheme: "https",
        "User-Agent": "PostmanRuntime/7.35.0",
        Cookie: cookies,
        Accept: "*/*",
        "Accept-Encoding": "gzip, deflate, br, zstd",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        Connection: "keep-alive",
        Referer: process.env.NSE_URL,
        "sec-ch-ua":
          '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        timeout: "30000",
      },
    });

    // console.log(secondResponse.data.data)
    const data = secondResponse.data.data;
    const sortedData = data
      .sort((a, b) =>
        a.metadata.totalTurnover > b.metadata.totalTurnover ? -1 : 1
      )
      .filter(
        (item) =>
          item.metadata.totalTurnover >= 100000 && item.metadata.iep >= 100
      );
    // const finalData = sortedData.slice(0, 150);

    const calculatedData = await sortedData.map((data) => {
      try {
        return transformNiftyAllData(data);
      } catch (err) {
        return null;
      }
    });
    await niftyAllData.deleteMany({});
    for (const data of calculatedData) {
      data.calculated = ((data.iep - data.yearHigh) * 100) / data.yearHigh;
      data.chart = `${process.env.TRADING_VIEW_API}${data.symbol}`;
      // data.tradeInfo = await fetchLiveMarketData(data.symbol);
      // console.log(data)
      await niftyAllData.insertMany(data);
    }
    return calculatedData;
  } catch (err) {
    console.log(err.message);
    return null;
  } finally {
    await jar.removeAllCookiesSync();
    console.log("Deleting all cookies");
  }
};

const fetchAndUpdateTradeInfoData = async () => {
  try {
    const data = await niftyAllData.find();

    if (data.length == 0) {
      await fetchAndStoreNiftyAllData();
    } else {
      for (singleData of data) {
        try {
          const tradeInfo = await fetchLiveMarketData(singleData.symbol);
          await niftyAllData.updateOne(
            { symbol: singleData.symbol },
            {
              $set: {
                tradeInfo: tradeInfo,
              },
            }
          );
        } catch (err) {
          console.log(
            `Error in updating data of symbol ${singleData.symbol} : `,
            err.message
          );
        }
      }
    }
  } catch (err) {
    console.log(`Error in updating Nifty All TradeInfo Details: `, err.message);
  }
};

const transformNiftyAllData = (data) => {
  const {
    symbol,
    lastPrice,
    change,
    pChange,
    previousClose,
    finalQuantity,
    totalTurnover,
    yearHigh,
    yearLow,
    iep,
  } = data.metadata;

  const {
    totalBuyQuantity,
    totalSellQuantity,
    atoBuyQty,
    atoSellQty,
    preopen,
  } = data.detail.preOpenMarket;

  const first4BuyQty = preopen.map((item) => item.buyQty || 0);
  const first4SellQty = preopen.slice(0, 4).map((item) => item.sellQty || 0);

  const sumFirst4Buy = first4BuyQty.reduce((acc, qty) => acc + qty, 0);
  const sumFirst4Sell = first4SellQty.reduce((acc, qty) => acc + qty, 0);

  let sum4rowBuyQty = sumFirst4Buy;
  let sum4rowSellQty = sumFirst4Sell;

  const atoPrice = preopen.find((row) => row.iep)?.price || iep;

  const totalBuyAnd4Buy = totalBuyQuantity + sumFirst4Buy;
  const totalSellAnd4Sell = totalSellQuantity + sumFirst4Sell;

  const totalBuyVsTotalSell =
    totalBuyQuantity !== 0 ? totalSellQuantity / totalBuyQuantity : 0;
  const sum4SellVssum4Buy =
    sumFirst4Buy !== 0 ? sumFirst4Sell / sumFirst4Buy : 0;
  const totalSellAndSum4SellVstotalBuyAndSum4Buy =
    totalBuyAnd4Buy !== 0 ? totalSellAnd4Sell / totalBuyAnd4Buy : 0;
  const additionValue =
    totalBuyVsTotalSell +
    sum4SellVssum4Buy +
    totalSellAndSum4SellVstotalBuyAndSum4Buy;
  const subtractedValue =
    totalSellAndSum4SellVstotalBuyAndSum4Buy - totalBuyVsTotalSell;
  // const uVsT = atoBuyAnd4Buy !== 0 ? atoSellAnd4Sell / atoBuyAnd4Buy : 0;

  // const iepPrice = preopen.find((item) => item.iep)?.price || 0;
  // const sCrossV = iepPrice * totalBuyVsTotalSell;

  // const calculatedperChange =
  //   yearHigh > 0 ? ((iep - yearHigh) * 100) / yearHigh : 0;

  const transformedData = {
    symbol,
    lastPrice,
    change,
    pChange,
    previousClose,
    finalQuantity,
    totalTurnover,
    yearHigh,
    yearLow,
    iep,
    totalBuyQuantity,
    totalSellQuantity,
    atoBuyQty,
    atoSellQty,
    sum4rowBuyQty,
    sum4rowSellQty,
    atoPrice,
    additionValue,
    subtractedValue,
    calculatedData: {
      totalBuyAnd4Buy,
      totalSellAnd4Sell,
      totalBuyVsTotalSell,
      sum4SellVssum4Buy,
      totalSellAndSum4SellVstotalBuyAndSum4Buy,
      // uVsT,
      // sCrossV,
      // calculatedperChange,
    },
  };

  return transformedData;
};

module.exports = { fetchAndStoreNiftyAllData, fetchAndUpdateTradeInfoData };
