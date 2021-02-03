//List of features to add:
// look up word definitions
// choose any random state license plate
// add client side dictionary
// solve new input in license if reveal button is hit
// save local client side copy of puzzle
// sort guesses by length

var express = require('express'); // Express web server framework
var fs = require('fs');

function PuzzleGenerator() {
    this.puzzle = null;
    this.template = '1AAA111';

    this.newPuzzle = function(template) {
        if (template) {
            this.template = template
        }
        var lic = this.generateRandomLicense();
        this.puzzle = {
            license:lic,
            solution:solvePuzzle(lic)
        }
        return this.puzzle

    };

    this.solveCustomPuzzle = function(custom_license) {
        this.puzzle = {
            license: custom_license,
            solution: solvePuzzle(custom_license)
        }
        return this.puzzle

    }

    var solvePuzzle = function(license) {
        var rgx = '\\b' + license.replace(/[0-9]/g,'').replace(/(\w)/g,'$1\\w*') + '\\b';
        var res = raw_dict.match(new RegExp(rgx, 'g'));
        var solution_type = 'strict';
        if (!res) {                                         // if not strict solution, allow leading characters
                                                            // e.g. XBM => EXHIBITIONISM
            var rgx_loose = '\\b\\w*' + license.replace(/[0-9]/g,'').replace(/(\w)/g,'$1\\w*') + '\\b';
            var res_loose = raw_dict.match(new RegExp(rgx_loose, 'g'));
            if (!res_loose) {
                return {solutions: ['No solution'], solution_type: null};
            }
            solution_type = 'loose'
            res = res_loose
        }
        res.sort(function(a,b) {return a.length-b.length});
        return {solutions: res, solution_type: solution_type}
    }

    this.generateRandomLicense = function() {
        var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var license = '';
        for (let i = 0; i<this.template.length; i++) {
            if (this.template.charAt(i).isletter()) {
                var seed = Math.floor(Math.random()*letters.length);
                license += letters[seed];
            } else if (this.template.charAt(i).isdigit()) {
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
fs.readFile(__dirname + '/public/dict/dictionary.txt', 'utf8', function(err, data) {
  if (err) throw err;
  raw_dict = data
});

app.get('/puzzle', (req,res) => {
    res.send(puzzleGenerator.puzzle)
});

app.get('/newpuzzle', (req,res) => {
    res.send(puzzleGenerator.newPuzzle(req.query.template));
});

app.get('/solvecustom', (req,res) => {
    res.send(puzzleGenerator.solveCustomPuzzle(req.query.custom_license));
});

app.listen(8888)

String.prototype.isletter = function() {
    return ((this >= 'A') && (this <= 'Z'));
}
String.prototype.isdigit = function() {
    return ((this >= '0') && (this <= '9'));
}