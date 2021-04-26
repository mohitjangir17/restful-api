const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: { type: String, required: true },
  price: { type: String, required: true },
  // productImage: { type: String },
  myimage: { type: String },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Products", productSchema);
