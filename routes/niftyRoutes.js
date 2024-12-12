const {fetchAndStoreNifty500Data} = require("../controllers/nifty500.js");
const {fetchAndStoreNiftyAllData} = require("../controllers/niftyAll.js");
const express = require("express");
const {fetchNiftyBankData} = require("../controllers/niftyBank.js");
const {fetchNifty50Data} = require("../controllers/nifty50.js");
const {fetchSecuritiesFOData} = require("../controllers/securitiesFO.js");
const niftyAllData = require("../models/niftyAllData.js");
const niftyBankdata = require("../models/niftyBankdata.js");
const nifty500Data = require("../models/nifty500Data.js");
const securititesFOData = require("../models/securititesFOData.js");
const nifty50data = require("../models/nifty50data.js");
const router = express.Router();

router.route("/fetchniftyalldata").get(async (req, res) => {
  try {
    const snapshot = await niftyAllData.find().sort({ totalTurnover: -1 });
    if (snapshot.length === 0) {
      const response = await fetchAndStoreNiftyAllData();
      res.status(200).send({
        data: response,
      });
    } else {
      res.status(200).send({
        data: snapshot,
      });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).send({
      data: "Internal Server Error",
    });
  }
});

router.route("/fetchnifty500data").get(async (req, res) => {
  try {
    const snapshot = await nifty500Data.find().sort();
    if (snapshot.length === 0) {
      const response = await fetchAndStoreNifty500Data({ priority: -1 });
      res.status(200).send({
        data: response,
      });
    } else {
      res.status(200).send({
        data: snapshot,
      });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).send({
      data: "Internal Server Error",
    });
  }
});

router.route("/fetchniftybankdata").get(async (req, res) => {
  try {
    const snapshot = await niftyBankdata.find().sort({ priority: -1 });
    if (snapshot.length === 0) {
      const response = await fetchNiftyBankData();
      res.status(200).send({
        data: response,
      });
    } else {
      res.status(200).send({
        data: snapshot,
      });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).send({
      data: "Internal Server Error",
    });
  }
});

router.route("/fetchnifty50data").get(async (req, res) => {
  try {
    const snapshot = await nifty50data.find();
    if (snapshot.length === 0) {
      const response = await fetchNifty50Data();
      res.status(200).send({
        data: response,
      });
    } else {
      res.status(200).send({
        data: snapshot,
      });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).send({
      data: "Internal Server Error",
    });
  }
});

router.route("/fetchsecuritiesdata").get(async (req, res) => {
  try {
    const snapshot = await securititesFOData.find().sort({ priority: -1 });
    if (snapshot.length === 0) {
      const response = await fetchSecuritiesFOData();
      res.status(200).send({
        data: response,
      });
    } else {
      res.status(200).send({
        data: snapshot,
      });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).send({
      data: "Internal Server Error",
    });
  }
});

module.exports = router;
