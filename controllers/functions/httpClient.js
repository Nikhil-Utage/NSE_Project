const axios = require("axios");
const httpContext = require("express-http-context");
const { HttpsProxyAgent } = require("https-proxy-agent");
const { CookieJar } = require("tough-cookie");
const { wrapper } = require("axios-cookiejar-support");

const jar = new CookieJar();
const client = wrapper(
  axios.create({
    jar,
    headers: {
      "User-Agent": "PostmanRuntime/7.35.0",
    },
  })
);
// client.interceptors.request.use(
//   (config) => {
//     console.log("Request sent:");
//     console.log(`URL: ${config.url}`);
//     console.log(`Method: ${config.method}`);
//     console.log("Headers:", config.headers);
//     console.log("Cookies:", jar.serializeSync());
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

const proxyHost = "brd.superproxy.io";
const proxyPort = 22225;
const proxyUsername =
  "brd-customer-hl_64a293b7-zone-residential-session-123-country-in";
const proxyPassword = "re81jf0sfdf0";
const enableHttpProxy = "true";

const getProxyUrl = (proxyId) => {
  if (!enableHttpProxy) {
    return null;
  }
  const usernameAndPassword =
    proxyUsername && proxyPassword ? `${proxyUsername}:${proxyPassword}@` : "";
  return `http://${usernameAndPassword}${proxyHost}:${proxyPort}`.replace(
    "REPLACE_ME_WITH_REQUEST_ID",
    proxyId
  );
};

let proxyUrl = getProxyUrl(httpContext.get("proxyId"));
let httpsAgent = null;
if (enableHttpProxy) {
  httpsAgent = new HttpsProxyAgent(proxyUrl, {
    keepAlive: true,
    maxSockets: 10,
    maxKeepAliveRequests: 0,
    maxKeepAliveTime: 2400000,
  });
}

const proxyOptions = {
  auth: {
    username: proxyUsername,
    password: proxyPassword,
  },
  host: proxyHost,
  port: proxyPort,
  rejectUnauthorized: false,
};

module.exports = { jar, client, proxyOptions };
