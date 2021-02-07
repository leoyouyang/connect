var express = require('express');
var app = express();

app.use(express.static("public"));

app.get("/", function(req, res) {
    res.send("<html><body><h1>Thanks for connecting!</h1></body></html>");
});

app.listen(80);