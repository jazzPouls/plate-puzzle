var express = require('express'); // Express web server framework
var request = require('request');
var path = require('path');
var fs = require('fs');

function PuzzleGenerator() {
    var puzzle = {};
    this.template = '1AAA111';

    this.newPuzzle = function(template) {
        if (!template) {
            this.template = template;
        }
        license = makeLicense(template);
        console.log(license);

    };

    var makeLicense = function(template) {
        var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var license = '';
        for (let i = 0; i<template.length; i++) {
            if (template.charAt(i).isletter()) {
                var seed = Math.floor(Math.random()*letters.length);
                license += letters[seed];
            } else if (template.charAt(i).isdigit()) {
                license += Math.floor(Math.random()*10);
            }
        }
        return license
    }

}

var puzzleGenerator = new PuzzleGenerator();

var app = express()
app.use(express.static(__dirname + '/public'))

fs.readFile(__dirname + '/public/dict/dictionary.txt', 'utf8', function(err, data) {
  if (err) throw err;
  var lines = data.split(/\r?\n/);
  console.log(data)
});

request.get(__dirname + '/public/dict/dictionary.txt', function (error, response, body) {
    if (error || response.statusCode !== 200) {
        throw error
    }
    var csv = body.split('/n/r');
    console.log(csv[10])
});

// app.get('/', (req,res) => {
//  res.sendFile(path.join(__dirname + '/public/index.html'));
// });

app.get('/puzzle', (req,res) => {
    var puzzle = puzzleGenerator.newPuzzle(req.query.template)
    res.send(puzzle)
});

app.listen(8888)






String.prototype.isletter = function() {
    return ((this >= 'A') && (this <= 'Z'));
}
String.prototype.isdigit = function() {
    return ((this >= '0') && (this <= '9'));
}