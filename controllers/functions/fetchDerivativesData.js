const { fetchAndSendDerivativesCookies } = require("./cookies.js");
const { client, proxyOptions, jar } = require("./httpClient.js");

const fetchDerivativesData = async (symbol) => {
  try {
    await jar.removeAllCookiesSync();
    const cookies = await fetchAndSendDerivativesCookies(symbol);
    const derivativesData = await client.get(
      `${process.env.DERIVATIES_API + symbol}`,
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

    const transformedData = await transformDerivativesData(
      derivativesData.data.stocks
    );

    return transformedData;
  } catch (err) {
    console.log(`Error fetching tradeInfoDetail for ${symbol}:`, err.message);
    return null;
  } finally {
    await jar.removeAllCookiesSync();
    console.log("Deleting all cookies");
  }
};

const transformDerivativesData = async (data) => {
  const sortedData = data.sort((a, b) =>
    a.metadata.totalTurnover > b.metadata.totalTurnover ? -1 : 1
  );

  const futuresData = sortedData.filter(
    (item) => item.metadata.instrumentType === "Stock Futures"
  );
  const optionsData = sortedData.filter(
    (item) => item.metadata.instrumentType === "Stock Options"
  );

  const finalFuturesData = extractRequiredFuturesData(futuresData.slice(0, 2));
  const finalOptionsData = extractRequiredOptionsData(optionsData.slice(0, 1));

  return {
    finalFuturesData,
    finalOptionsData,
  };
};

const extractRequiredFuturesData = (dataArray) => {
  return dataArray.map((item) => ({
    totalBuyQuantity: item.marketDeptOrderBook?.totalBuyQuantity,
    totalSellQuantity: item.marketDeptOrderBook?.totalSellQuantity,
    calculated:
      item.marketDeptOrderBook?.totalBuyQuantity !== 0
        ? item.marketDeptOrderBook?.totalSellQuantity /
          item.marketDeptOrderBook?.totalBuyQuantity
        : 0,
  }));
};

const extractRequiredOptionsData = (dataArray) => {
  const item = dataArray[0];
  return {
    totalBuyQuantity: item.marketDeptOrderBook?.totalBuyQuantity,
    totalSellQuantity: item.marketDeptOrderBook?.totalSellQuantity,
    calculated:
      item.marketDeptOrderBook?.totalBuyQuantity !== 0
        ? item.marketDeptOrderBook?.totalSellQuantity /
          item.marketDeptOrderBook?.totalBuyQuantity
        : 0,
    optionType: item.metadata?.optionType,
    strikePrice: item.metadata?.strikePrice,
  };
};

module.exports = fetchDerivativesData;
