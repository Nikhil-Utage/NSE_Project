const securititesFOData = require("../models/securititesFOData.js");
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

const fetchSecuritiesFOData = async () => {
  try {
    const cookies = await fetchAndSendLiveMarketCookies();
    console.log(cookies);
    const secondResponse = await client.get(process.env.NSE_SECURITIES_FO, {
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
        Connection: "keep-alive",
        "user-agent": "PostmanRuntime/7.35.0",
        priority: "u=1, i",
      },
      timeout: 30000,
    });
    const data = secondResponse.data.data;
    data.map((obj) => {
      obj.calculatedValue = calculatePriceChange(obj);
    });
    const calculatedData = await data.map((eachData) => {
      try {
        return mapToSecuritiesSchema(eachData);
      } catch (err) {
        return null;
      }
    });
    await jar.removeAllCookiesSync();
    console.log("Deleting all cookies");
    await securititesFOData.deleteMany({});
    for (const data of calculatedData) {
      // data.preOpenMarketInfo = await fetchPreOpenMarketData(data.symbol);
      console.log("Fetching Securities data for symbol: ", data.symbol);
      if (data.symbol.includes("&")) {
        data.symbol = data.symbol.replace(/&/g, "%26");
      }
      data.tradeInfo = await fetchLiveMarketData(data.symbol);
      data.derivativesData = await fetchDerivativesData(data.symbol);
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
      await securititesFOData.insertMany(data);
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

const fetchAndUpdateSecuritiesFOData = async () => {
  try {
    const cookies = await fetchAndSendLiveMarketCookies();
    console.log(cookies);
    const secondResponse = await client.get(process.env.NSE_SECURITIES_FO, {
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
        Connection: "keep-alive",
        "user-agent": "PostmanRuntime/7.35.0",
        priority: "u=1, i",
      },
      timeout: 30000,
    });
    const data = secondResponse.data.data;
    data.map((obj) => {
      obj.calculatedValue = calculatePriceChange(obj);
    });
    const calculatedData = await data.map((eachData) => {
      try {
        return mapToSecuritiesSchema(eachData);
      } catch (err) {
        return null;
      }
    });
    await jar.removeAllCookiesSync();
    console.log("Deleting all cookies");
    for (const data of calculatedData) {
      // data.preOpenMarketInfo = await fetchPreOpenMarketData(data.symbol);
      console.log("Fetching Securities data for symbol: ", data.symbol);
      if (data.symbol.includes("&")) {
        data.symbol = data.symbol.replace(/&/g, "%26");
      }
      data.tradeInfo = await fetchLiveMarketData(data.symbol);
      data.derivativesData = await fetchDerivativesData(data.symbol);
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
      await securititesFOData.updateOne(
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

function mapToSecuritiesSchema(data) {
  return {
    symbol: data.symbol || "",
    open: data.open ? parseFloat(data.open) : 0,
    dayHigh: data.dayHigh ? parseFloat(data.dayHigh) : 0,
    dayLow: data.dayLow ? parseFloat(data.dayLow) : 0,
    previousClose: data.previousClose ? parseFloat(data.previousClose) : 0,
    lastPrice: data.lastPrice ? parseFloat(data.lastPrice) : 0,
    change: data.change ? parseFloat(data.change) : 0,
    pChange: data.pChange ? parseFloat(data.pChange) : 0,
    totalTradedVolume: data.totalTradedVolume
      ? parseFloat(data.totalTradedVolume)
      : 0,
    totalTradedValue: data.totalTradedValue
      ? parseFloat(data.totalTradedValue)
      : 0,
    yearHigh: data.yearHigh ? parseFloat(data.yearHigh) : 0,
    yearLow: data.yearLow ? parseFloat(data.yearLow) : 0,
    perChange30d: data.perChange30d ? parseFloat(data.perChange30d) : 0,
    perChange365d: data.perChange365d ? parseFloat(data.perChange365d) : 0,
    liveMarketCalculation: data.calculatedValue
      ? parseFloat(data.calculatedValue)
      : 0,
  };
}

module.exports = { fetchSecuritiesFOData, fetchAndUpdateSecuritiesFOData };
