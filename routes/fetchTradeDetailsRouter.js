const {
  fetchTradeDetailsForNifyAll,
  fetchTradeDetails,
} = require("../controllers/fetchMarketTradeDetails.js");
const fetchOISpurtsData = require("../controllers/functions/fetchOISpurtsData.js");
const express = require("express");
const router = express.Router();
router
  .route("/niftyall/fetchparticulartradedetails/:symbol")
  .get(async (req, res) => {
    try {
      const symbol = req.params.symbol;
      if (!symbol) {
        return res.status(404).send({
          msg: "No Trade Symbol Found",
        });
      }

      const data = await fetchTradeDetailsForNifyAll(symbol);

      res.status(200).send(data);
    } catch (err) {
      console.log(err.message);
      res.status(500).send({
        msg: "Interal Server Error",
      });
    }
  });

router.route("/fetchparticulartradedetails/:symbol").get(async (req, res) => {
  try {
    const symbol = req.params.symbol;
    if (!symbol) {
      return res.status(404).send({
        msg: "No Trade Symbol Found",
      });
    }

    const data = await fetchTradeDetails(symbol);

    res.status(200).send(data);
  } catch (err) {
    console.log(err.message);
    res.status(500).send({
      msg: "Interal Server Error",
    });
  }
});

router.route("/fetchparticulartradeoispurts/:symbol").get(async (req, res) => {
  try {
    const symbol = req.params.symbol;
    if (!symbol) {
      return res.status(404).send({
        msg: "No Trade Symbol Found",
      });
    }

    const data = await fetchOISpurtsData(symbol);

    res.status(200).send(data);
  } catch (err) {
    console.log(err.message);
    res.status(500).send({
      msg: "Interal Server Error",
    });
  }
});

module.exports = router;
