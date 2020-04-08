const express = require("express");
const bodyParser = require("body-parser");
const fs = require('fs');
const { Client } = require('whatsapp-web.js');
const SESSION_FILE_PATH = './session.json';
var authed=false;
let sessionCfg;
if (fs.existsSync(SESSION_FILE_PATH)) {
    sessionCfg = require(SESSION_FILE_PATH);
}
const client = new Client({ puppeteer: { headless: true , args:['--no-sandbox','--disable-setuid-sandbox','--unhandled-rejections=strict'] }, session: sessionCfg});
const app = express();

const port = process.env.PORT || 5000;
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

var last_qr;


client.on('qr', qr => {
    last_qr=qr;
});

app.listen(port, () => {
    console.log("Server Running Live on Port : " + port);
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
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.initialize();


app.get('/getqr',(req,res) => {
    var qrjs = fs.readFileSync('/components/qrcode.js');
    var page = `
        <html>
            <body>
                <script>${qrjs}</script>
                <div id="qrcode"></div>
                <script type="text/javascript">
                    new QRCode(document.getElementById("qrcode"), "${last_qr}");
                </script>
            </body>
        </html>
    `
    if(!authed){
        res.write(page)
        res.end();
    }else{
        res.write("<html><body><h2>Already Authenticated</h2></body></html>");
        res.end();
    }
        
});

app.post('/sendmessage',(req,res) => {
    let phone = req.body.phone;
    let message = req.body.message;

    if(phone==undefined||message==undefined){
        res.send({status:"error",message:"please enter valid phone and message"})
    }else{
        client.sendMessage(phone+'@c.us',message).then((response)=>{
            if(response.id.fromMe){
                res.send({status:'success',message:'Message successfully send to '+phone})
            }
        });
    }
});

app.get('/getchatbyid',(req,res) => {
    let phone = req.body.phone;
    if(phone==undefined){
        res.send({status:"error",message:"please enter valid phone number"});
    }else{
        client.getChatById(phone+"@c.us").then((chat) => {
            res.end({ status:"success", message: "Returned chat!", data: JSON.stringify(chat)});
        }).catch(() => {
            console.error("getchaterror")
            res.end({status:"error",message:"getchaterror"})
        })
    }
})
