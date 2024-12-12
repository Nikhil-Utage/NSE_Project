const express = require("express");
const niftyRouter = require("./routes/niftyRoutes.js");
const connectDB = require("./db.js");
const cors = require("cors");
const TradeRouter = require("./routes/fetchTradeDetailsRouter.js");
const cron = require("node-cron");
const {
  fetchAndStoreNiftyAllData,
  fetchAndUpdateTradeInfoData,
} = require("./controllers/niftyAll.js");
const {fetchAndStoreNifty500Data, fetchAndUpdateNifty500Data} = require("./controllers/nifty500.js");
const {fetchNiftyBankData, fetchAndUpdateNiftyBankData} = require("./controllers/niftyBank.js");
const {fetchSecuritiesFOData, fetchAndUpdateSecuritiesFOData} = require("./controllers/securitiesFO.js");
const {fetchNifty50Data, fetchAndUpdateNifty50Data} = require("./controllers/nifty50.js");
require("dotenv").config();
const { spawn } = require("child_process");
const path = require("path");

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());

const puppeteer = require("puppeteer");

// app.use("*",async  (req,res,next)=>{
//   // console.log("AAAAAAA")
//   // const scriptPath = path.join(__dirname,"puppeteer.js");
//   // await spawn('node', [scriptPath]);
//   // next();
//   (async ()=>{
//     console.log("hi hello");
//     const browser = await puppeteer.launch({/*executablePath: '/usr/bin/chromium-browser',*/ headless:true, args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-dev-shm-usage']});
//     const page = await browser.newPage();
//     await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
//     await page.setExtraHTTPHeaders({
//         'Accept-Language': 'en-US,en;q=0.9',
//         'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
//         'Connection': 'keep-alive',
//       });
//     await page.goto('https://www.nseindia.com',{ waitUntil: 'networkidle2' });
//     console.log("I ran this");
//     next();
// })();
// })

app.use("/api/nifty", niftyRouter);

app.use("/api/tradedetails", TradeRouter);
app.use("*", async (req, res) => {
  res.send("All the API's are working");
});

// cron.schedule("*/15 * * * *", async () => {
//   console.log("Starting to fetch New Data");
//   await fetchAndStoreNiftyAllData();
//   await fetchAndStoreNifty500Data();
//   await fetchNiftyBankData();
//   await fetchSecuritiesFOData();
//   await fetchNifty50Data();
//   console.log("Fetched and updated New Data");
// });

cron.schedule("8 9 * * 1-5", async () => {
  console.log("Fetching Nifty All Data at 9:09 AM");
  await fetchAndStoreNiftyAllData();
});
cron.schedule("15 9 * * 1-5", async () => {
  console.log("Starting to fetch New Data");
  await fetchAndStoreNifty500Data();
  await fetchNiftyBankData();
  await fetchSecuritiesFOData();
  await fetchNifty50Data();
  console.log("Fetched and updated New Data");
});



cron.schedule("*/15 9-15 * * 1-5", async () => {
  const currentHour = new Date().getHours();
  const currentMinute = new Date().getMinutes();

  if (
    (currentHour >= 15 && currentMinute > 29) ||
    (currentHour === 9 && currentMinute <= 29)
  ) {
    console.log(`Cron Job ran at ${currentHour} : ${currentMinute}`);
    return;
  }

  console.log("Starting to fetch New Data");
  // await fetchAndUpdateTradeInfoData();
  await fetchAndUpdateNifty500Data();
  await fetchAndUpdateNiftyBankData();
  await fetchAndUpdateSecuritiesFOData();
  await fetchAndUpdateNifty50Data();
  console.log("Fetched and updated New Data");
});

app.listen(PORT, (err) => {
  if (err) {
    console.log("Error running server", err.message);
  } else {
    console.log("Server running on port: ", PORT);
    connectDB();
  }
});
