//List of features to add:
// look up word definitions
// choose any random state license plate
// add client side dictionary
// solve new input in license if reveal button is hit
// save local client side copy of puzzle
// sort guesses by length

// This is a word puzzle game that I came up with based on the 3 random letters in CA license plates.
// Find the shortest word that starts with the first letter and contains the second two in order.

var express = require('express'); // Express web server framework
var PuzzleGenerator = require('./PuzzleGenerator.js')

var app = express()
app.use(express.static(__dirname + '/public'))
app.use(express.static("public"));

var puzzleGenerator = new PuzzleGenerator();

app.get('/puzzle', (req,res) => {
    res.send(puzzleGenerator.puzzle);
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