const express = require("express");
const router = express.Router();
const multer = require("multer");
const product = require("../models/product");
const path = require("path");
const { body, validationResult } = require("express-validator");
const { requireAuth, checkUser } = require("../authentication/auth");

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: function (req, file, cb) {
    cb(
      null,
      file.originalname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
});

const Product = require("../models/product");
const { route } = require("./orders");

router.get("/", checkUser, (req, res) => {
  Product.find()
    .sort([["date", -1]])
    .exec()
    .then((docs) => {
      // console.log(docs);
      res.render("productspage", { title: "Products", products: docs });

      // res.status(200).json(docs);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.post(
  "/",
  body("name", "Name is required").isEmpty(),
  body("price", "Price is required").isEmpty(),
  express.urlencoded({ extended: false }),
  requireAuth,
  upload.single("myimage"),
  (req, res, next) => {
    const errors = validationResult(req);
    const alert = errors.array();
    if (!errors.isEmpty()) {
      console.log(errors);
      return res.render("productspage", { alert });
    }
    const product = new Product({
      name: req.body.name,
      price: req.body.price,
      myimage: req.file.path,
    });
    // console.log(product);
    product
      .save()
      .then(() => {
        res.redirect("/products");
      })
      .catch((err) => {
        res.send(err);
        console.log(err);
      });
  }
);
router.get("/:productID", (req, res) => {
  const id = req.params.productId;
  Product.findById(id)
    .exec()
    .then((doc) => {
      // console.log(doc);
      res.status(200).json(doc);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.patch("/:productId", requireAuth, (req, res) => {
  const id = req.params.productId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  product
    .updateOne({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.post(
  "/delete",
  express.urlencoded({ extended: false }),
  requireAuth,
  (req, res) => {
    const id = req.body.id;
    Product.deleteOne({ _id: id })
      .exec()
      .then((result) => {
        res.redirect("/products");
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ error: err });
      });
  }
);

module.exports = router;
