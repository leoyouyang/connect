var datastore = require('nedb');
var db = new datastore({ filename: 'database.json', autoload: true });
var express = require('express');
var app = express();

app.use(express.static('public'));

app.get('/formdata', function (req, res) {
    if (req.query.food != ""){
        var dataToSave = {
            food: req.query.food,
            meal: req.query.meal,
            comment: req.query.comment
        };

        db.insert(dataToSave, function (err, newDoc) {
            db.find({}, function(err, docs) {
                //var dataWrapper = {data: docs};
                //res.render("outputtemplate.ejs", dataWrapper)
                res.send(docs);
            });
        });
    }
});

app.listen(80, function() {
    console.log("Port 80!");
});