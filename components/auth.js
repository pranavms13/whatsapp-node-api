const router = require('express').Router();
const fs = require('fs');

router.get('/checkauth', async (req, res) => {
    client.getState().then((data) => {
        console.log(data)
        res.send(data)
    }).catch((err) => {
        if (err) {
            res.send("DISCONNECTED")
            try {
                fs.unlinkSync('../session.json')
            } catch(err) {
                console.log(err)
            }
        }
    })
});

router.get('/getqr', (req,res) => {
    fs.readFile('components/last.qr', (err,last_qr) => {
        fs.readFile('session.json', (serr, sessiondata) => {
            if (err && sessiondata) {
                res.write("<html><body><h2>Already Authenticated</h2></body></html>");
                res.end();
            } else if (!err && serr) {
                var page = `
                    <html>
                        <body>
                            <script type="module">
                            </script>
                            <div id="qrcode"></div>
                            <script type="module">
                            import QrCreator from "https://cdn.jsdelivr.net/npm/qr-creator/dist/qr-creator.es6.min.js";
                            let container = document.getElementById("qrcode");
                            QrCreator.render({
                                text: "${last_qr}",
                                radius: 0.5, // 0.0 to 0.5
                                ecLevel: "H", // L, M, Q, H
                                fill: "#536DFE", // foreground color
                                background: null, // color or null for transparent
                                size: 256, // in pixels
                            }, container);
                            </script>
                        </body>
                    </html>
                `
                res.write(page)
                res.end();
            }
        })
    });
});

module.exports = router;