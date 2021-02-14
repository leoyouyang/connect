var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var urlencodedBodyParser = bodyParser.urlencoded({extended: true});
app.use(urlencodedBodyParser);

app.use(express.static('public'));

var submittedData = [];

app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.post('/formdata', function (req, res) {
    var dataToSave = {
        food: req.body.food,
        meal: req.body.meal
    };

    submittedData.push(dataToSave);

    var output = "<html><head><link href='https://fonts.googleapis.com/css?family=Mansalva&display=swap' rel='stylesheet'><link href='https://fonts.googleapis.com/css?family=Nunito:600&display=swap' rel='stylesheet'><link rel='stylesheet' type='text/css' href='index.css'></head><body>";
    output += "<h1 style='color: #111111;'>What I Ate Today</h1>";
    for (var i = 0; i < submittedData.length; i++) {
        output += "<div>I had " + submittedData[i].food + " for " + submittedData[i].meal + ".</div>";
    }
    output += "<br><div><a href='../'>Back</a></div></html>";
    res.send(output);
});

app.listen(80, function() {
    console.log("Port 80!");
});