const express = require("express");
const bodyParser = require("body-parser");
const fs = require('fs');
const axios = require('axios');
const shelljs = require('shelljs');

const config = require('./config.json');
const { Client } = require('whatsapp-web.js');
const SESSION_FILE_PATH = process.env.SESSION_FILE_PATH || './session.json';

let sessionCfg;
if (fs.existsSync(SESSION_FILE_PATH)) {
    sessionCfg = require(SESSION_FILE_PATH);
}

process.title = "whatsapp-node-api";
global.client = new Client({
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--unhandled-rejections=strict'
    ]},
    session: sessionCfg
});

global.authed = false;

const app = express();

const port = process.env.PORT || config.port;
//Set Request Size Limit 50 MB
app.use(bodyParser.json({ limit: '50mb' }));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

client.on('qr', qr => {
    fs.writeFileSync('./components/last.qr', qr);
});


client.on('authenticated', (session) => {
    console.log("AUTH!");
    sessionCfg = session;

    fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function (err) {
        if (err) {
            console.error(err);
        }
        authed = true;
    });

    try {
        fs.unlinkSync('./components/last.qr')
    } catch(err) {}
});

client.on('auth_failure', () => {
    console.log("AUTH Failed !")
    sessionCfg = ""
    process.exit()
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', async msg => {
    if (config.webhook.enabled) {
        if (msg.hasMedia) {
            const attachmentData = await msg.downloadMedia()
            msg.attachmentData = attachmentData
        }
        axios.post(config.webhook.path, { msg })
    }
})
client.initialize();

const chatRoute = require('./components/chatting');
const groupRoute = require('./components/group');
const authRoute = require('./components/auth');
const contactRoute = require('./components/contact');

app.use(function(req, res, next){
    console.log(req.method + ' : ' + req.path);
    next();
});
app.use('/chat',chatRoute);
app.use('/group',groupRoute);
app.use('/auth',authRoute);
app.use('/contact',contactRoute);

app.listen(port, () => {
    console.log("Server Running Live on Port : " + port);
});
