const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderHistorySchema = new Schema(
  {
    invoiceNo: { type: String, required: true },
    orderDate: { type: String, required: true },
    orderTime: { type: String, required: true },
    orderNo: { type: String, required: true },
    userInfo: {
      userName: { type: String },
      userNum: { type: String },
    },
    // orderDetails: {
    //   name: { type: String, required: true },
    //   quantity: { type: String, required: true },
    //   unitPrice: { type: String, required: true },
    //   totalPrice: { type: String, required: true },
    // },
    orderDetails: { type: Object, required: true },
    // invoiceImg: { type: Buffer, required: true },
  },
  {
    timestamps: true,
  }
);

const OrderHistory = mongoose.model("OrderHistory", orderHistorySchema);

module.exports = OrderHistory;
