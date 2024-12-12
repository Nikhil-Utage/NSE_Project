const { fetchAndSendTradeMarketCookies } = require("./cookies.js");
const { client, proxyOptions, jar } = require("./httpClient.js");

const fetchVolumesAverageData = async (symbol) => {
  try {
    await jar.removeAllCookiesSync();
    const cookies = await fetchAndSendTradeMarketCookies(symbol);
    const volumesData = await client.get(
      `${process.env.VOLUMES_API + symbol}`,
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
    const requiredData = transformVolumesData(volumesData.data.data);

    return requiredData;
  } catch (err) {
    console.log(`Error fetching volumes data for ${symbol}:`, err.message);
    return null;
  } finally {
    await jar.removeAllCookiesSync();
    console.log("Deleting all cookies");
  }
};

const transformVolumesData = async (data) => {
  let sumOfVolumes = 0;

  data.map((item) => {
    try {
      sumOfVolumes += item.CH_TOT_TRADED_QTY;
    } catch (err) {
      console.log(
        `Error adding volumeData for ${item.CH_SYMBOL}: ${err.message}`
      );
    }
  });
  let avgOfVolumes = data.length !== 0 ? sumOfVolumes / data.length : 0;
  return {
    tradedVolume: sumOfVolumes,
    avgOfVolumes: avgOfVolumes,
    calculated: avgOfVolumes !== 0 ? sumOfVolumes / avgOfVolumes : 0,
  };
};

module.exports = { fetchVolumesAverageData };
