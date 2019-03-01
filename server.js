var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongo = require('mongoose');

mongo.connect("mongodb://localhost:27017/angularMongo", { useNewUrlParser: true }, function (err, response) {
    if (!err) {
        console.log("connected to MongoDB");
    } else {
        console.log(err);
    }
});

var app = express();
app.use(bodyParser());
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

var Schema = mongo.Schema;

var personsSchema = new Schema({
    name: { type: String },
    profession: { type: String },
    status: { type: String }
});

var personModel = mongo.model('persons', personsSchema, 'persons');

app.get("/persons", function (req, res) {
    personModel.find({}, function (err, data) {
        if (err) {
            res.send(err);
        } else {
            res.send(data);
        }
    })
});

app.post("/persons/save", function (req, res) {
    var person = { name: req.body.name, profession: req.body.profession, status: req.body.status };
    personModel.create(person, function (err, data) {
        if (err) {
            res.send(err);
        } else {
            res.send(data);
        }
    })
});

app.put("/persons/:id", function (req, res) {
    personModel.findByIdAndUpdate(req.params.id, req.body, function (err, data) {
        if (err) {
            res.send(err);
        } else {
            res.send(data);
        }
    })
});

app.post("/persons/:id", function (req, res) {
    personModel.findByIdAndDelete(req.params.id, function (err, data) {
        if (err) {
            res.send(err);
        } else {
            res.send(data);
        }
    })
});

app.listen(8080, function () {
    console.log("Mongo listening on 8080");
})
