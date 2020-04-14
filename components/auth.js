const router = require('express').Router();
const fs = require('fs');

router.get('/getqr', (req,res) => {
    var qrjs = fs.readFileSync('components/qrcode.js');
    fs.readFile('components/last.qr',function(err,last_qr){
        if(err){
            res.write("<html><body><h2>Already Authenticated</h2></body></html>");
            res.end();
        }else{
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
            res.write(page)
            res.end();
        }
    });
});
module.exports = router;