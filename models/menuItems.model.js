const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const menuItemListSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    priceFull: { type: String, required: true },
    priceHalf: { type: String },
    category: { type: String, required: true },
    // image: { type: Object },
  },
  {
    timestamps: true,
  }
);

const MenuItems = mongoose.model("MenuItems", menuItemListSchema);

module.exports = MenuItems;
