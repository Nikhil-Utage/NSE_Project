const nifty500Data = require("../models/nifty500Data.js");
const { getLiveMarketCookies } = require("./functions/cookies.js");
const { calculatePriceChange } = require("./functions/dataCalculation.js");
// const {
//   getDateDifference,
//   getDaysFromCurrentDate,
// } = require("./functions/dateDifference.js");
const fetchLiveMarketData = require("./functions/fetchLiveMarketData.js");
// const { fetchPreOpenMarketData } = require("./functions/fetchPreOpenData.js");
// const { fetchVolumesAverageData } = require("./functions/fetchVolumesData.js");
const { client, jar, proxyOptions } = require("./functions/httpClient.js");

require("dotenv").config();

const fetchAndStoreNifty500Data = async () => {
  try {
    const cookies = await getLiveMarketCookies();
    const secondResponse = await client.get(process.env.NIFTY_500_URL, {
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
        Connection: "keep-alive",
        "sec-ch-ua":
          '"Chromium";v="128", "Not A(Brand)";v="24", "Google Chrome";v="128"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "user-agent": "PostmanRuntime/7.35.0",
        priority: "u=1, i",
      },
      timeout: 60000,
    });
    const data = secondResponse.data.data;
    data.map((obj) => {
      obj.calculatedValue = calculatePriceChange(obj);
    });
    const calculatedData = await data.map((eachData) => {
      try {
        return transformNifty500Data(eachData);
      } catch (err) {
        return null;
      }
    });
    await nifty500Data.deleteMany({});
    for (const data of calculatedData) {
      console.log("Fetching Nifty 500 data for symbol: ", data.symbol);
      if (data.symbol !== "NIFTY 500") {
        // data.preOpenMarketInfo = await fetchPreOpenMarketData(data.symbol);
        if (data.symbol.includes("&")) {
          data.symbol = data.symbol.replace(/&/g, "%26");
        }
        data.tradeInfo = await fetchLiveMarketData(data.symbol);
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
      }
      data.chart = `${process.env.TRADING_VIEW_API}${data.symbol}`;
      await nifty500Data.insertMany(data);
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

const fetchAndUpdateNifty500Data = async () => {
  try {
    const cookies = await getLiveMarketCookies();
    const secondResponse = await client.get(process.env.NIFTY_500_URL, {
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
        Connection: "keep-alive",
        "sec-ch-ua":
          '"Chromium";v="128", "Not A(Brand)";v="24", "Google Chrome";v="128"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "user-agent": "PostmanRuntime/7.35.0",
        priority: "u=1, i",
      },
      timeout: 60000,
    });
    const data = secondResponse.data.data;
    data.map((obj) => {
      obj.calculatedValue = calculatePriceChange(obj);
    });
    const calculatedData = await data.map((eachData) => {
      try {
        return transformNifty500Data(eachData);
      } catch (err) {
        return null;
      }
    });
    for (const data of calculatedData) {
      console.log("Fetching Nifty 500 data for symbol: ", data.symbol);
      if (data.symbol !== "NIFTY 500") {
        if (data.symbol.includes("&")) {
          data.symbol = data.symbol.replace(/&/g, "%26");
        }
        // data.preOpenMarketInfo = await fetchPreOpenMarketData(data.symbol);
        data.tradeInfo = await fetchLiveMarketData(data.symbol);
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
      }
      data.chart = `${process.env.TRADING_VIEW_API}${data.symbol}`;
      await nifty500Data.updateOne(
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

const transformNifty500Data = (data) => {
  return {
    priority: data.priority || 0,
    symbol: data.symbol || "",
    open: data.open || 0,
    dayHigh: data.dayHigh || 0,
    dayLow: data.dayLow || 0,
    previousClose: data.previousClose || 0,
    lastPrice: data.lastPrice || 0,
    change: data.change || 0,
    pChange: data.pChange || 0,
    totalTradedVolume: data.totalTradedVolume || 0,
    totalTradedValue: data.totalTradedValue || 0,
    yearHigh: data.yearHigh || 0,
    yearLow: data.yearLow || 0,
    perChange30d: data.perChange30d || 0,
    perChange365d: data.perChange365d || 0,
    liveMarketCalculation: data.calculatedValue || 0,
  };
};

module.exports = { fetchAndStoreNifty500Data, fetchAndUpdateNifty500Data };
