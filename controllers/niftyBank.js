const niftyBankdata = require("../models/niftyBankdata.js");
const { fetchAndSendLiveMarketCookies } = require("./functions/cookies.js");
const { calculatePriceChange } = require("./functions/dataCalculation.js");
// const {
//   getDateDifference,
//   getDaysFromCurrentDate,
// } = require("./functions/dateDifference.js");
const fetchDerivativesData = require("./functions/fetchDerivativesData.js");
const fetchLiveMarketData = require("./functions/fetchLiveMarketData.js");
// const fetchOISpurtsData = require("./functions/fetchOISpurtsData.js");
// const { fetchPreOpenMarketData } = require("./functions/fetchPreOpenData.js");
// const { fetchVolumesAverageData } = require("./functions/fetchVolumesData.js");
const { client, jar, proxyOptions } = require("./functions/httpClient.js");

require("dotenv").config();

const fetchNiftyBankData = async () => {
  try {
    const cookies = await fetchAndSendLiveMarketCookies();
    console.log(cookies);
    const secondResponse = await client.get(process.env.NIFTY_BANK_URL, {
      ...proxyOptions,
      headers: {
        authority: "www.nseindia.com",
        method: "GET",
        scheme: "https",
        accept: "*/*",
        "accept-encoding": "gzip, deflate, br, zstd",
        "accept-language": "en-US,en;q=0.9",
        "cache-control": "no-cache",
        cookie: cookies,
        pragma: "no-cache",
        referer: process.env.LIVE_EQUITY_NSE_URL,
        "sec-ch-ua":
          '"Chromium";v="128", "Not A(Brand)";v="24", "Google Chrome";v="128"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "user-agent": "PostmanRuntime/7.35.0",
        priority: "u=1, i",
        Connection: "keep-alive",
      },
      timeout: 10000,
    });
    const data = secondResponse.data.data;
    data.map((obj) => {
      obj.liveMarketCalculation = calculatePriceChange(obj);
    });
    const calculatedData = await data.map((eachData) => {
      try {
        return transformNiftyBankData(eachData);
      } catch (err) {
        return null;
      }
    });
    await niftyBankdata.deleteMany({});
    for (const data of calculatedData) {
      // data.preOpenMarketInfo = await fetchPreOpenMarketData(data.symbol);
      console.log("Fetching Nifty Bank data for symbol: ", data.symbol);
      if (data.symbol.includes("&")) {
        data.symbol = data.symbol.replace(/&/g, "%26");
      }
      data.tradeInfo = await fetchLiveMarketData(data.symbol);
      data.derivativesData = await fetchDerivativesData(data.symbol);
      try {
        data.totalSellVsTotalBuy =
          data.tradeInfo?.ratio +
          (data.derivativesData.finalFuturesData?.reduce(
            (sum, item) => sum + (item.calculated || 0),
            0
          ) || 0);
      } catch (err) {
        data.totalSellVsTotalBuy = 0;
      }
      // data.oiSpurtsInfo = await fetchOISpurtsData(data.symbol);
      // data.volumesData = await fetchVolumesAverageData(data.symbol);
      // try {
      //   data.tradeInfo.calculated.diffOfHighAndLowDates =
      //     getDateDifference(
      //       data.preOpenMarketInfo?.yearHighDate,
      //       data.preOpenMarketInfo.yearLowDate
      //     ) || 0;
      //   data.tradeInfo.calculated.diffOfCurrentAndyearHighDate =
      //     getDaysFromCurrentDate(data.preOpenMarketInfo.yearHighDate) || 0;
      // } catch (err) {
      //   console.log(
      //     `Error for fetching difference of dates for ${data.symbol}`
      //   );
      // }
      data.chart = `${process.env.TRADING_VIEW_API}${data.symbol}`;
      await niftyBankdata.insertMany(data);
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

const fetchAndUpdateNiftyBankData = async () => {
  try {
    const cookies = await fetchAndSendLiveMarketCookies();
    console.log(cookies);
    const secondResponse = await client.get(process.env.NIFTY_BANK_URL, {
      ...proxyOptions,
      headers: {
        authority: "www.nseindia.com",
        method: "GET",
        scheme: "https",
        accept: "*/*",
        "accept-encoding": "gzip, deflate, br, zstd",
        "accept-language": "en-US,en;q=0.9",
        "cache-control": "no-cache",
        cookie: cookies,
        pragma: "no-cache",
        referer: process.env.LIVE_EQUITY_NSE_URL,
        "sec-ch-ua":
          '"Chromium";v="128", "Not A(Brand)";v="24", "Google Chrome";v="128"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "user-agent": "PostmanRuntime/7.35.0",
        priority: "u=1, i",
        Connection: "keep-alive",
      },
      timeout: 10000,
    });
    const data = secondResponse.data.data;
    data.map((obj) => {
      obj.liveMarketCalculation = calculatePriceChange(obj);
    });
    const calculatedData = await data.map((eachData) => {
      try {
        return transformNiftyBankData(eachData);
      } catch (err) {
        return null;
      }
    });
    for (const data of calculatedData) {
      // data.preOpenMarketInfo = await fetchPreOpenMarketData(data.symbol);
      console.log("Fetching Nifty Bank data for symbol: ", data.symbol);
      if (data.symbol.includes("&")) {
        data.symbol = data.symbol.replace(/&/g, "%26");
      }
      data.tradeInfo = await fetchLiveMarketData(data.symbol);
      data.derivativesData = await fetchDerivativesData(data.symbol);
      try {
        data.totalSellVsTotalBuy =
          data.tradeInfo?.ratio +
          (data.derivativesData.finalFuturesData?.reduce(
            (sum, item) => sum + (item.calculated || 0),
            0
          ) || 0);
      } catch (err) {
        data.totalSellVsTotalBuy = 0;
      }
      // data.oiSpurtsInfo = await fetchOISpurtsData(data.symbol);
      // data.volumesData = await fetchVolumesAverageData(data.symbol);
      // try {
      //   data.tradeInfo.calculated.diffOfHighAndLowDates =
      //     getDateDifference(
      //       data.preOpenMarketInfo?.yearHighDate,
      //       data.preOpenMarketInfo.yearLowDate
      //     ) || 0;
      //   data.tradeInfo.calculated.diffOfCurrentAndyearHighDate =
      //     getDaysFromCurrentDate(data.preOpenMarketInfo.yearHighDate) || 0;
      // } catch (err) {
      //   console.log(
      //     `Error for fetching difference of dates for ${data.symbol}`
      //   );
      // }
      data.chart = `${process.env.TRADING_VIEW_API}${data.symbol}`;
      await niftyBankdata.updateOne(
        { symbol: data.symbol },
        { $set: data },
        { upsert: true }
      );
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

const transformNiftyBankData = (data) => {
  const {
    priority,
    symbol,
    open,
    dayHigh,
    dayLow,
    previousClose,
    lastPrice,
    change,
    pChange,
    totalTradedVolume,
    totalTradedValue,
    yearHigh,
    yearLow,
    perChange30d,
    perChange365d,
    calculatedValue,
  } = data;

  const transformedData = {
    priority,
    symbol,
    open,
    dayHigh,
    dayLow,
    previousClose,
    lastPrice,
    change,
    pChange,
    totalTradedVolume,
    totalTradedValue,
    yearHigh,
    yearLow,
    perChange30d,
    perChange365d,
    calculatedValue,
  };

  return transformedData;
};

module.exports = { fetchNiftyBankData, fetchAndUpdateNiftyBankData };
