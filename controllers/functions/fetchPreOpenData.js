const { fetchAndSendTradeMarketCookies } = require("./cookies.js");
const {
  addCalculatedFieldsForPreOpenMarket,
  preOpenDataCalculation,
} = require("./dataCalculation");
const { client, proxyOptions, jar } = require("./httpClient.js");

const fetchPreOpenMarketData = async (symbol) => {
  try {
    const cookies = await fetchAndSendTradeMarketCookies(symbol);
    const preOpenDetail = await client.get(
      process.env.LIVE_EQUITY_PREOPEN + symbol,
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
          "Sec-Ch-Ua":
            '"Chromium";v="128", "Not A(Brand)";v="24", "Google Chrome";v="128"',
          "Sec-Ch-Ua-Mobile": "?0",
          "Sec-Ch-Ua-Platform": '"Windows"',
          "Sec-Fetch-Dest": "empty",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Site": "same-origin",
          Connection: "keep-alive",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36",
        },
        timeout: 30000,
      }
    );
    const calculatedData = await addCalculatedFieldsForPreOpenMarket(
      preOpenDetail.data
    );
    const finalData = transformPreOpenMarketData(calculatedData);
    return finalData;
  } catch (err) {
    console.log(`Error fetching preOpenDetail for ${symbol}:`, err.message);
    return null;
  } finally {
    await jar.removeAllCookiesSync();
    console.log("Deleting all cookies");
  }
};

const fetchPreOpenMarketDataForNiftyAll = async (symbol) => {
  try {
    const cookies = await fetchAndSendTradeMarketCookies(symbol);
    const preOpenDetail = await client.get(
      process.env.LIVE_EQUITY_PREOPEN + symbol,
      {
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
          "Sec-Ch-Ua":
            '"Chromium";v="128", "Not A(Brand)";v="24", "Google Chrome";v="128"',
          "Sec-Ch-Ua-Mobile": "?0",
          "Sec-Ch-Ua-Platform": '"Windows"',
          "Sec-Fetch-Dest": "empty",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Site": "same-origin",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36",
        },
        timeout: 60000,
      }
    );
    const calculatedData = await preOpenDataCalculation(preOpenDetail.data);
    return preOpenDetail.data;
  } catch (err) {
    console.log(`Error fetching preOpenDetail for ${symbol}:`, err.message);
    return err;
  } finally {
    await jar.removeAllCookiesSync();
    console.log("Deleting all cookies");
  }
};

module.exports = { fetchPreOpenMarketData, fetchPreOpenMarketDataForNiftyAll };

const transformPreOpenMarketData = (data) => {
  return {
    prevClose: data.preOpenMarket?.prevClose || 0,
    iep: data.preOpenMarket?.IEP || 0,
    change: data.preOpenMarket?.Change || 0,
    perChange: data.preOpenMarket?.perChange || 0,
    final: data.preOpenMarket?.finalPrice || 0,
    finalQty: data.preOpenMarket?.finalQuantity || 0,
    yearHigh: data.priceInfo.weekHighLow.max || 0,
    yearHighDate: data.priceInfo?.weekHighLow?.maxDate || "",
    yearLow: data.priceInfo.weekHighLow.min || 0,
    yearLowDate: data.priceInfo?.weekHighLow?.minDate || "",
    calculation:
      ((data.preOpenMarket?.IEP - data.priceInfo.weekHighLow.max) * 100) /
        data.priceInfo.weekHighLow.max || 0,
    totalBuyQuantity: data.preOpenMarket?.totalBuyQuantity || 0,
    totalSellQuantity: data.preOpenMarket?.totalSellQuantity || 0,
    atoBuyQty: data.preOpenMarket?.atoBuyQty || 0,
    atoSellQty: data.preOpenMarket?.atoSellQty || 0,
    sum4rowBuyQty:
      data.calculated?.atoBuyAnd4Buy - data.preOpenMarket?.atoBuyQty || 0,
    sum4rowSellQty:
      data.calculated?.atoSellAnd4Sell - data.preOpenMarket?.atoSellQty || 0,
    atoPrice: data.preOpenMarket?.finalPrice || 0,
    calculatedData: {
      atoBuyAnd4Buy: data.calculated?.atoBuyAnd4Buy || 0,
      atoSellAnd4Sell: data.calculated?.atoSellAnd4Sell || 0,
      totalBuyVsTotalSell: data.calculated?.totalBuyVsTotalSell || 0,
      sum4SellVssum4Buy: data.calculated?.sum4SellVssum4Buy || 0,
      atoSellVsAtoBuy: data.calculated?.atoSellVsAtoBuy || 0,
      uVsT: data.calculated?.uVsT || 0,
      sCrossV: data.calculated?.sCrossV || 0,
      calculatedperChange: data.calculated?.calculatedperChange || 0,
    },
  };
};
