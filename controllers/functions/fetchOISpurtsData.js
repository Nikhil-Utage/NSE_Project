const { fetchAndSendOICookies } = require("./cookies.js");
const { client, proxyOptions, jar } = require("./httpClient.js");

async function fetchOISpurtsData(symbol) {
  try {
    const cookies = await fetchAndSendOICookies();
    console.log("Fetched Cookies for OI Spurts data for", symbol);
    const apiResponse = await client.get(process.env.NSE_SPURTS_API, {
      ...proxyOptions,
      headers: {
        authority: "www.nseindia.com",
        method: "GET",
        path: "/api/live-analysis-oi-spurts-underlyings",
        scheme: "https",
        Accept: "*/*",
        "Accept-Encoding": "gzip, deflate, br, zstd",
        "Accept-Language": "en-US,en;q=0.9",
        "Cache-Control": "no-cache",
        Cookie: cookies,
        Pragma: "no-cache",
        Referer: process.env.NSE_SPURTS_API,
        "Sec-Ch-Ua":
          '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
        "Sec-Ch-Ua-Mobile": "?0",
        "Sec-Ch-Ua-Platform": '"Windows"',
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
        Connection: "keep-alive",
        "User-Agent": "PostmanRuntime/7.35.0",
        priority: "u=1, i",
        timeout: 60000,
      },
    });
    const data = apiResponse.data.data;
    const result = data.find((item) => item.symbol === symbol);
    const convertedData = convertToOISpurtsFormat(result);
    console.log(`Fetched Data for ${symbol}`);

    return convertedData || 0;
  } catch (err) {
    console.log(err.message);
    return null;
  } finally {
    await jar.removeAllCookiesSync();
    console.log("Deleting all cookies");
  }
}

const convertToOISpurtsFormat = (data) => {
  return {
    perChnageinOI: data.avgInOI || 0,
    volume: data.volume || 0,
    value: data.futValue || 0,
    optionsValue: data.optValue || 0,
    totalValue: data.total || 0,
  };
};

module.exports = fetchOISpurtsData;
