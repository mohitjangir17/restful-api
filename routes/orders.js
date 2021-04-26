const express = require("express");
const router = express.Router();
const Order = require("../models/orders");
const { requireAuth } = require("../authentication/auth");
const { checkUser } = require("../authentication/auth");
const { check } = require("express-validator");

router.get("/", requireAuth, checkUser, (req, res) => {
  Order.find()
    .sort([["date", -1]])
    .exec()
    .then((docs) => {
      res.render("orders", { title: "Orders", items: docs });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});
router.post("/quantity", requireAuth, (req, res) => {
  const order = new Order({
    _id: req.body.id,
    product: req.body.product,
    quantity: req.body.quantity,
  });
  order
    .save()
    .then((result) => {
      console.log(result);
      res.redirect("/orders");
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});
router.get("/:orderId", requireAuth, (req, res) => {
  id = req.params.orderId;
  Order.findById(id)
    .exec()
    .then((doc) => {
      // console.log(doc);
      res.render("orders", {
        title: "Orders",
        items: doc,
        id: req.params.orderId,
      });
      // res.status(201).json(order);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});
router.post("/:orderId", requireAuth, (req, res) => {
  Order.remove({ _id: req.params.orderId })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

module.exports = router;
