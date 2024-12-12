const nifty50data = require("../models/nifty50data.js");
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

const fetchNifty50Data = async () => {
  try {
    const cookies = await fetchAndSendLiveMarketCookies();

    const secondResponse = await client.get(process.env.NIFTY_50_URL, {
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
        return transformDataToNifty50Schema(eachData);
      } catch (err) {
        return null;
      }
    });
    await jar.removeAllCookiesSync();
    console.log("Deleting all cookies");
    await nifty50data.deleteMany({});
    for (const data of calculatedData) {
      console.log("Fetching Nifty 50 data for symbol: ", data.symbol);
      if (data.symbol !== "NIFTY 50") {
        if (data.symbol.includes("&")) {
          data.symbol = data.symbol.replace(/&/g, "%26");
        }
        // data.preOpenMarketInfo = await fetchPreOpenMarketData(data.symbol);
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
      } else {
        data.tradeInfo = null;
        data.derivativesData = null;
      }
      data.chart = `${process.env.TRADING_VIEW_API}${data.symbol}`;
      await nifty50data.insertMany(data);
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

const fetchAndUpdateNifty50Data = async () => {
  try {
    const cookies = await fetchAndSendLiveMarketCookies();

    const secondResponse = await client.get(process.env.NIFTY_50_URL, {
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
        return transformDataToNifty50Schema(eachData);
      } catch (err) {
        return null;
      }
    });
    await jar.removeAllCookiesSync();
    console.log("Deleting all cookies");
    for (const data of calculatedData) {
      console.log("Fetching Nifty 50 data for symbol: ", data.symbol);
      if (data.symbol !== "NIFTY 50") {
        if (data.symbol.includes("&")) {
          data.symbol = data.symbol.replace(/&/g, "%26");
        }
        // data.preOpenMarketInfo = await fetchPreOpenMarketData(data.symbol);
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
      } else {
        data.tradeInfo = null;
        data.derivativesData = null;
      }
      data.chart = `${process.env.TRADING_VIEW_API}${data.symbol}`;
      await nifty50data.updateOne(
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

const transformDataToNifty50Schema = (data) => {
  return {
    priority: isNaN(data.priority) ? null : data.priority,
    symbol: data.symbol || null,
    open: isNaN(data.open) ? null : data.open,
    dayHigh: isNaN(data.dayHigh) ? null : data.dayHigh,
    dayLow: isNaN(data.dayLow) ? null : data.dayLow,
    previousClose: isNaN(data.previousClose) ? null : data.previousClose,
    lastPrice: isNaN(data.lastPrice) ? null : data.lastPrice,
    change: isNaN(data.change) ? null : data.change,
    pChange: isNaN(data.pChange) ? null : data.pChange,
    totalTradedVolume: isNaN(data.totalTradedVolume)
      ? null
      : data.totalTradedVolume,
    totalTradedValue: isNaN(data.totalTradedValue)
      ? null
      : data.totalTradedValue,
    yearHigh: isNaN(data.yearHigh) ? null : data.yearHigh,
    yearLow: isNaN(data.yearLow) ? null : data.yearLow,
    perChange30d: isNaN(data.perChange30d) ? null : data.perChange30d,
    perChange365d: isNaN(data.perChange365d) ? null : data.perChange365d,
    liveMarketCalculation: isNaN(data.calculatedValue)
      ? null
      : data.calculatedValue,
  };
};

module.exports = { fetchNifty50Data, fetchAndUpdateNifty50Data };
