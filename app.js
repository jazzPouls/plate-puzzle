var express = require('express'); // Express web server framework
var path = require('path');

var generateRandomLicense = function (length) {
	var text = ''
	var letter = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
	var number = '0123456789'
};

function Puzzler() {

}

var Puzzler = new Puzzler();

var app = express()
app.use(express.static(__dirname + '/public'))

// app.get('/', (req,res) => {
// 	res.sendFile(path.join(__dirname + '/public/index.html'));
// });

app.get('/puzzle', (req,res) => {
	for (let k in req) {
		console.log(k)
	}
	console.log(req)
	console.log(req.query)
	var puzzle = Puzzler.generateNewPuzzle()
	res.send(puzzle)
});

app.listen(8888)