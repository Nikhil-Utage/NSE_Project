const { fetchAndSendTradeMarketCookies } = require("./cookies.js");
const { client, proxyOptions, jar } = require("./httpClient.js");

const fetchLiveMarketData = async (symbol) => {
  try {
    await jar.removeAllCookiesSync();
    const cookies = await fetchAndSendTradeMarketCookies(symbol);
    const tradeInfoDetail = await client.get(
      `${process.env.LIVE_EQUITY_TRADE_INFO + symbol}&section=trade_info`,
      {
        ...proxyOptions,
        headers: {
          Authority: "www.nseindia.com",
          Method: "GET",
          Scheme: "https",
          Accept: "*/*",
          "Accept-Encoding": "gzip, deflate, br, zstd",
          "Accept-Language": "en-US,en;q=0.9",
          "Cache-Control": "no-cache",
          Cookie: cookies,
          Pragma: "no-cache",
          Referer: `https://www.nseindia.com/get-quotes/equity?symbol=${symbol}`,
          "Sec-ch-ua":
            '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
          "Sec-ch-ua-mobile": "?0",
          "Sec-ch-ua-platform": '"Windows"',
          "Sec-fetch-dest": "empty",
          "Sec-fetch-mode": "cors",
          "Sec-fetch-site": "same-origin",
          "User-agent": "PostmanRuntime/7.35.0",
          Connection: "keep-alive",
        },
        timeout: 30000,
      }
    );
    const convertedData = transformToTradeInfoSchema(tradeInfoDetail.data);
    return convertedData;
  } catch (err) {
    console.log(`Error fetching tradeInfoDetail for ${symbol}:`, err.message);
    return null;
  } finally {
    await jar.removeAllCookiesSync();
    console.log("Deleting all cookies");
  }
};

module.exports = fetchLiveMarketData;

const transformToTradeInfoSchema = (data) => {
  // const parseDate = (dateString) => {
  //   if (!dateString) return null;
  //   const cleanedDate = dateString.replace("EOD", "").trim();
  //   return new Date(cleanedDate);
  // };
  // const yearHighDate = parseDate(data.securityWiseDP.secWiseDelPosDate) || null;
  // const yearLowDate = parseDate(data.securityWiseDP.secWiseDelPosDate) || null;

  return {
    orderBookBuyQty: isNaN(data.marketDeptOrderBook.totalBuyQuantity)
      ? null
      : data.marketDeptOrderBook.totalBuyQuantity,
    ordrtBookSelQty: isNaN(data.marketDeptOrderBook.totalSellQuantity)
      ? null
      : data.marketDeptOrderBook.totalSellQuantity,
    ratio:
      data.marketDeptOrderBook.totalBuyQuantity === 0
        ? 0
        : data.marketDeptOrderBook.totalSellQuantity /
          data.marketDeptOrderBook.totalBuyQuantity,
    // totalTradedValue: isNaN(data.marketDeptOrderBook.tradeInfo.totalTradedValue)
    //   ? null
    //   : data.marketDeptOrderBook.tradeInfo.totalTradedValue,
    // totalMarketCap: isNaN(data.marketDeptOrderBook.tradeInfo.totalMarketCap)
    //   ? null
    //   : data.marketDeptOrderBook.tradeInfo.totalMarketCap,
    // deliverableVsTradedQty: isNaN(data.securityWiseDP.deliveryQuantity)
    //   ? null
    //   : data.securityWiseDP.deliveryQuantity,
    // dailyVolatility: isNaN(
    //   parseFloat(data.marketDeptOrderBook.tradeInfo.cmDailyVolatility)
    // )
    //   ? null
    //   : parseFloat(data.marketDeptOrderBook.tradeInfo.cmDailyVolatility),
    // annualisedVolatility: isNaN(
    //   parseFloat(data.marketDeptOrderBook.tradeInfo.cmAnnualVolatility)
    // )
    //   ? null
    //   : parseFloat(data.marketDeptOrderBook.tradeInfo.cmAnnualVolatility),
    // yearHighDate: yearHighDate || null,
    // yearLowDate: yearLowDate || null,
    // calculated: {
    //   diffOfHighAndLowDates:
    //     yearHighDate && yearLowDate
    //       ? Math.floor((yearHighDate - yearLowDate) / (1000 * 60 * 60 * 24))
    //       : null,

    //   diffOfCurrentAndyearHighDate: yearHighDate
    //     ? Math.floor((new Date() - yearHighDate) / (1000 * 60 * 60 * 24))
    //     : null,
    // },
  };
};
