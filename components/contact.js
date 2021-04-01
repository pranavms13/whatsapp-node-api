const router = require('express').Router();

router.get('/getcontacts', (req, res) => {
    client.getContacts().then((contacts) => {
        res.send(JSON.stringify(contacts));
    });
});

router.get('/getcontact/:phone', async (req, res) => {
    let phone = req.params.phone;

    if (phone != undefined) {
        client.getContactById(`${phone}@c.us`).then((contact) => {
            res.send(JSON.stringify(contact));
        }).catch((err) => {
            res.send({ status: 'error', message: 'Not found' });
        });
    }
});

router.get('/getprofilepic/:phone', async (req, res) => {
    let phone = req.params.phone;

    if (phone != undefined) {
        client.getProfilePicUrl(`${phone}@c.us`).then((imgurl) => {
            if (imgurl) {
                res.send({ status: 'success', message: imgurl });
            } else {
                res.send({ status: 'error', message: 'Not Found' });
            }
        })
    }
});

router.get('/isregistereduser/:phone', async (req, res) => {
    let phone = req.params.phone;
    
    if (phone != undefined) {
        client.isRegisteredUser(`${phone}@c.us`).then((is) => {

            is ? res.send({ status: 'success', message: `${phone} is a whatsapp user` })
                : res.send({ status: 'error', message: `${phone} is not a whatsapp user` });
        })
    } else {
        res.send({ status: 'error', message: 'Invalid Phone number' });
    }
});

module.exports = router;