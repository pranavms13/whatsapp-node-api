const router = require('express').Router();
const { MessageMedia } = require("whatsapp-web.js");

router.post('/sendmessage/:phone', async (req,res) => {
    let phone = req.params.phone;
    let message = req.body.message;

    if(phone==undefined||message==undefined){
        res.send({status:"error",message:"please enter valid phone and message"})
    }else{
        client.sendMessage(phone+'@c.us',message).then((response)=>{
            if(response.id.fromMe){
                res.send({status:'success',message:'Message successfully sent to '+phone})
            }
        });
    }
});

router.post('/sendimage/:phone', async (req,res) => {
    let phone = req.params.phone;
    let image = req.body.image;
    let caption = req.body.caption;

    if(phone==undefined||image==undefined){
        res.send({status:"error",message:"please enter valid phone and base64 encoded image"})
    }else{
        let media = new MessageMedia('image/png',image);
        client.sendMessage(phone+'@c.us',media,{caption:caption||""}).then((response)=>{
            if(response.id.fromMe){
                res.send({status:'success',message:'MediaMessage successfully sent to '+phone})
            }
        });
    }
});

router.get('/getchatbyid/:phone', async (req,res) => {
    let phone = req.params.phone;
    if(phone==undefined){
        res.send({status:"error",message:"please enter valid phone number"});
    }else{
        client.getChatById(phone+"@c.us").then((chat) => {
            res.send({ status:"success", message: chat});
        }).catch(() => {
            console.error("getchaterror")
            res.send({status:"error",message:"getchaterror"})
        })
    }
});

router.get('/getchats', async (req,res) => {
    client.getChats().then((chats) => {
        res.send({ status:"success", message: chats});
    }).catch(() => {
        res.send({status:"error",message:"getchatserror"})
    })
});

module.exports = router;