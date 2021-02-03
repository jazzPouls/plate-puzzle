//List of features to add:
// look up word definitions
// choose any random state license plate
// add client side dictionary
// solve new input in license if reveal button is hit
// save local client side copy of puzzle
// sort guesses by length

var express = require('express'); // Express web server framework
var PuzzleGenerator = require('./PuzzleGenerator.js')

var app = express()
app.use(express.static(__dirname + '/public'))

var puzzleGenerator = new PuzzleGenerator();

app.get('/puzzle', (req,res) => {
    res.send(puzzleGenerator.puzzle)
});

app.get('/newpuzzle', (req,res) => {
    res.send(puzzleGenerator.newPuzzle(req.query.template));
});

app.get('/solvecustom', (req,res) => {
    res.send(puzzleGenerator.solveCustomPuzzle(req.query.custom_license));
});

const port = process.env.PORT || 8888;
const listener = app.listen(port, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

String.prototype.isletter = function() {
    return ((this >= 'A') && (this <= 'Z'));
}
String.prototype.isdigit = function() {
    return ((this >= '0') && (this <= '9'));
}