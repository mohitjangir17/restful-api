const mongoose = require("mongoose");

const ordersSchema = mongoose.Schema({
  // _id: mongoose.Schema.Types.ObjectId,
  product: { type: String },
  quantity: { type: String, default: 1 },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Orders", ordersSchema);
