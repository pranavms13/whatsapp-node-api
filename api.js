const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const axios = require("axios");
const shelljs = require("shelljs");
const cors = require('cors')
const mongoose = require("mongoose");

const config = require("./config.json");
const { Client, LocalAuth } = require("whatsapp-web.js");

const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

process.title = "whatsapp-node-api";
global.client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: { headless: true },
});

global.authed = false;

require('dotenv').config();

const app = express();
const port = process.env.PORT || config.port;
// app.use(cors())

const uri = process.env.ATLAS_URI;
mongoose.connect(uri);
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

//Set Request Size Limit 50 MB
app.use(bodyParser.json({ limit: "50mb" }));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

client.on("qr", (qr) => {
  console.log("qr");
  fs.writeFileSync("./components/last.qr", qr);
});

client.on("authenticated", () => {
  console.log("AUTH!!");
  authed = true;

  try {
    fs.unlinkSync("./components/last.qr");
  } catch (err) {}
});

client.on("auth_failure", () => {
  console.log("AUTH Failed !");
  process.exit();
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("message", async (msg) => {
  if (config.webhook.enabled) {
    if (msg.hasMedia) {
      const attachmentData = await msg.downloadMedia();
      msg.attachmentData = attachmentData;
    }
    axios.post(config.webhook.path, { msg });
  }
});
client.on("disconnected", () => {
  console.log("disconnected");
});
client.initialize();

const chatRoute = require("./components/chatting");
const groupRoute = require("./components/group");
const authRoute = require("./components/auth");
const contactRoute = require("./components/contact");
const menuItemRoute = require("./routes/menuItems");
const orderHistoryRoute = require("./routes/orderHistory");


app.use(function (req, res, next) {
  console.log(req.method + " : " + req.path);
  next();
});
app.use("/chat", cors(corsOptions) ,chatRoute);
app.use("/group", cors(corsOptions), groupRoute);
app.use("/auth", cors(corsOptions), authRoute);
app.use("/contact", cors(corsOptions), contactRoute);
app.use("/menuItem", cors(corsOptions), menuItemRoute);
app.use("/orderHistory", cors(corsOptions), orderHistoryRoute);


app.listen(port, () => {
  console.log("Server Running Live on Port : " + port);
});

// const axios = require('axios');
// axios.post('http://localhost:3002/chat/sendmessage/9768189269', {
//     message: 'Hello World',
//   })
//   .then(function (response) {
//     console.log(response);
//   })
//   .catch(function (error) {
//     console.log(error);
//   });