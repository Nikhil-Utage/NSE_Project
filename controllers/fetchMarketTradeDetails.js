const { getLiveMarketCookies } = require("./functions/cookies.js");
const fetchDerivativesData = require("./functions/fetchDerivativesData.js");
const fetchLiveMarketData = require("./functions/fetchLiveMarketData.js");
const {
  fetchPreOpenMarketData,
  fetchPreOpenMarketDataForNiftyAll,
} = require("./functions/fetchPreOpenData.js");
const { fetchVolumesAverageData } = require("./functions/fetchVolumesData.js");
const { jar } = require("./functions/httpClient.js");
require("dotenv").config();

const fetchTradeDetails = async (symbol) => {
  try {
    // console.log(process.env.LIVE_EQUITY_PREOPEN + symbol);
    // const preOpenData = await fetchPreOpenMarketData(symbol);
    console.log(
      process.env.LIVE_EQUITY_TRADE_INFO + symbol + "&section=trade_info"
    );
    const tradeInfoDetail = await fetchLiveMarketData(symbol);

    // console.log(process.env.DERIVATIES_API + symbol);
    // const derivativesData = await fetchDerivativesData(symbol);

    // console.log(process.env.VOLUMES_API + symbol);
    // const volumesData = await fetchVolumesAverageData(symbol);
    return {
      symbol: symbol,
      // preOpenData: preOpenData,
      tradeInfoData: tradeInfoDetail,
      // derivativesData,
      // volumesData,
    };
  } catch (err) {
    console.log(`Error Fetching details for ${symbol}: ${err}`);
    return err.message;
  } finally {
    await jar.removeAllCookiesSync();
    console.log("Deleting all cookies");
  }
};

const fetchTradeDetailsForNifyAll = async (symbol) => {
  try {
    // const cookies = await getLiveMarketCookies();
    console.log(process.env.LIVE_EQUITY_PREOPEN + symbol);
    const preOpenData = await fetchPreOpenMarketDataForNiftyAll(symbol);

    console.log(
      process.env.LIVE_EQUITY_TRADE_INFO + symbol + "&section=trade_info"
    );
    const tradeInfoDetail = await fetchLiveMarketData(symbol);

    return {
      symbol: symbol,
      preOpenData: preOpenData,
      tradeInfoData: tradeInfoDetail,
    };
  } catch (err) {
    console.log(`Error Fetching details for ${symbol}: ${err}`);
    return err.message;
  }
};

module.exports = { fetchTradeDetails, fetchTradeDetailsForNifyAll };
