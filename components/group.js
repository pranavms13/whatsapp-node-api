const router = require('express').Router();
const { MessageMedia } = require("whatsapp-web.js");

router.post('/sendmessage/:chatname', async (req,res) => {
    let chatname = req.params.chatname;
    let message = req.body.message;

    if(chatname==undefined||message==undefined){
        res.send({status:"error",message:"please enter valid chatname and message"})
    }else{
        client.getChats().then((data) => {
            data.forEach(chat => {
                if(chat.id.server==="g.us" && chat.name===chatname){
                    client.sendMessage(chat.id._serialized,message).then((response)=>{
                        if(response.id.fromMe){
                            res.send({status:'success',message:'Message successfully send to '+chatname})
                        }
                    });
                }
            });     
        });
    }
});

router.post('/sendimage/:chatname', async (req,res) => {
    let chatname = req.params.chatname;
    let image = req.body.image;
    let caption = req.body.caption;

    if(chatname==undefined||image==undefined){
        res.send({status:"error",message:"please enter valid chatname and base64 encoded image"})
    }else{
        client.getChats().then((data) => {
            data.forEach(chat => {
                if(chat.id.server==="g.us" && chat.name===chatname){
                    let media = new MessageMedia('image/png',image);
                    client.sendMessage(chat.id._serialized,media,{caption:caption||""}).then((response)=>{
                        if(response.id.fromMe){
                            res.send({status:'success',message:'Message successfully send to '+chatname})
                        }
                    });
                }
            });     
        });
    }
});

module.exports = router;