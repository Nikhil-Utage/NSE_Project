const { jar, client, proxyOptions } = require("./httpClient.js");
require("dotenv").config();

async function fetchAndSendCookies() {
  try {
    console.log("Fetching new cookies");
    await client.get(process.env.NSE_URL, {
      ...proxyOptions,
      headers: {
        "User-Agent": "PostmanRuntine/7.35.0",
        "Accept-Language": "en-US,en;q=0.9",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
        Connection: "keep-alive",
      },
    });

    const cookies = jar.getCookiesSync(process.env.NSE_BASE_URL);
    return cookies;
  } catch (error) {
    console.error("Error:", error.message);
    return null;
  }
}

async function getCookies() {
  const cookies = await fetchAndSendCookies();
  const cookieString = cookies.join("; ");
  return cookieString;
}
//---------------------------------------------------------------------------------------
async function fetchAndSendLiveMarketCookies() {
  try {
    console.log("Fetching new cookies for Live market");
    await client.get(process.env.LIVE_EQUITY_NSE_URL, {
      ...proxyOptions,
      headers: {
        "User-Agent": "PostmanRuntime/7.35.0",
        "Accept-Language": "en-US,en;q=0.9",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
        Connection: "keep-alive",
      },
    });

    const cookies = jar.getCookiesSync(process.env.LIVE_EQUITY_NSE_URL);
    return cookies;
  } catch (error) {
    console.error("Error:", error.message);
    return null;
  }
}

async function getLiveMarketCookies() {
  const cookies = await fetchAndSendLiveMarketCookies();
  const cookieString = cookies.join("; ");
  return cookieString;
}

async function fetchAndSendTradeMarketCookies(symbol) {
  try {
    console.log(`Fetching new cookies for ${symbol}`);
    await client.get(`${process.env.NSE_TRADE_INFO_URL}${symbol}`, {
      ...proxyOptions,
      headers: {
        "User-Agent": "PostmanRuntime/7.35.0",
        "Accept-Language": "en-US,en;q=0.9",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
        Connection: "keep-alive",
      },
    });

    const cookies = jar.getCookiesSync(process.env.LIVE_EQUITY_NSE_URL);
    return cookies.join("; ");
  } catch (error) {
    console.error("Error:", error.message);
    return null;
  }
}

async function fetchAndSendOICookies() {
  try {
    console.log("Fetching new cookies for OI Spurts");
    await client.get(process.env.NSE_SPURTS_URL, {
      ...proxyOptions,
      headers: {
        "User-Agent": "PostmanRuntime/7.35.0",
        "Accept-Language": "en-US,en;q=0.9",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
        Connection: "keep-alive",
      },
    });

    const cookies = jar.getCookiesSync(process.env.LIVE_EQUITY_NSE_URL);
    return cookies;
  } catch (error) {
    console.error("Error:", error.message);
    return null;
  }
}

async function fetchAndSendDerivativesCookies(symbol) {
  try {
    console.log(`Fetching new cookies for Derivatives for ${symbol}`);
    await client.get(`${process.env.NSE_DERIVATIVES_URL}${symbol}`, {
      ...proxyOptions,
      headers: {
        "User-Agent": "PostmanRuntime/7.35.0",
        "Accept-Language": "en-US,en;q=0.9",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
        Connection: "keep-alive",
      },
    });

    const cookies = jar.getCookiesSync(process.env.LIVE_EQUITY_NSE_URL);
    return cookies;
  } catch (error) {
    console.error("Error:", error.message);
    return null;
  }
}

module.exports = {
  getCookies,
  getLiveMarketCookies,
  fetchAndSendOICookies,
  fetchAndSendTradeMarketCookies,
  fetchAndSendLiveMarketCookies,
  fetchAndSendDerivativesCookies,
};
