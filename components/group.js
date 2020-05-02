const router = require('express').Router();

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

module.exports = router;