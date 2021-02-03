//List of features to add:
// look up words
// choose any random state license plate
// enter in custom license plate

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
        lic = makeLicense(template);
        var sol = solvePuzzle(lic);
        puzzle = {
            license:lic,
            solution:sol
        }
        return puzzle

    };

    var solvePuzzle = function(license) {
        var rgx = '\\b' + license.replace(/[0-9]/g,'').replace(/(\w)/g,'$1\\w*') + '\\b';
        var res = raw_dict.match(new RegExp(rgx, 'g'));
        var strict = true
        if (!res) {                                         // if not strict solution, allow leading characters
                                                            // e.g. XBM => EXHIBITIONISM
            var rgx_loose = '\\b\\w*' + license.replace(/[0-9]/g,'').replace(/(\w)/g,'$1\\w*') + '\\b';
            var res_loose = raw_dict.match(new RegExp(rgx_loose, 'g'));
            if (!res_loose) {
                console.log('No solution');
                return null;
            }
            console.log('Loose solution found');
            strict = false
            res = res_loose
        }
        res.sort(function(a,b) {
            return a.length-b.length
        })
        return {solutions: res, strict: strict}
    }

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

var raw_dict = '';
var words = new Array();

fs.readFile(__dirname + '/public/dict/dictionary.txt', 'utf8', function(err, data) {
  if (err) throw err;
  raw_dict = data
  words = data.split(/\r?\n/);
});

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