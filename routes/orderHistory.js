const router = require("express").Router();
let OrderHistory = require("../models/orderHistory.model");

router.route("/getOrderHistory").get((req, res) => {
  OrderHistory.find()
    .then((order) => res.json(order))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/addOrderHistory").post((req, res) => {
  const invoiceNo = req.body.invoiceNo;
  const orderDate = req.body.orderDate;
  const orderTime = req.body.orderTime;
  const orderNo = req.body.orderNo;
  const userInfo = req.body.userInfo;
  const orderDetails = req.body.orderDetails;
  // const invoiceImg = req.body.invoiceImg;

  const newOrderHistory = new OrderHistory({
    invoiceNo,
    orderDate,
    orderTime,
    userInfo,
    orderNo,
    orderDetails,
    // invoiceImg,
  });

  newOrderHistory
    .save()
    .then(() =>
      res.json({
        data: {
          statusCode: 200,
          title: "Hurray...!!",
          message: "Order placed successfully.",
        },
      })
    )
    .catch((err) =>
      res.status(400).json({
        data: {
          statusCode: 400,
          title: "Opps...!!",
          message: err.message,
        },
      })
    );
});

module.exports = router;
