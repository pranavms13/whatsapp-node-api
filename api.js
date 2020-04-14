const express = require("express");
const bodyParser = require("body-parser");
const fs = require('fs');
const { Client } = require('whatsapp-web.js');
const SESSION_FILE_PATH = './session.json';
let sessionCfg;
if (fs.existsSync(SESSION_FILE_PATH)) {
    sessionCfg = require(SESSION_FILE_PATH);
}
global.client = new Client({ puppeteer: { headless: true , args:['--no-sandbox','--disable-setuid-sandbox','--unhandled-rejections=strict'] }, session: sessionCfg});
const app = express();

const port = process.env.PORT || 5000;
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

client.on('qr', qr => {
    fs.writeFileSync('./components/last.qr',qr);
});


client.on('authenticated', (session) => {
    console.log("AUTH!", session);
    sessionCfg = session;
    fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function(err) {
        if (err) {
            console.error(err);
        }
        authed=true;
    });
    try{
        fs.unlinkSync('./components/last.qr')
    }catch(err){}
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.initialize();

const chatRoute = require('./components/chatting');
const authRoute = require('./components/auth');

app.use('/chat',chatRoute);
app.use('/auth',authRoute);

app.listen(port, () => {
    console.log("Server Running Live on Port : " + port);
});
