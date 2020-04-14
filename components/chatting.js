const router = require('express').Router();

router.post('/sendmessage', async (req,res) => {
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

router.get('/getchatbyid', async (req,res) => {
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
});
module.exports = router;