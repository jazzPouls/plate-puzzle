var puzzleHBSource = document.getElementById('puzzle-template').innerHTML,
    puzzleTemplate = Handlebars.compile(puzzleHBSource),
    puzzlePlaceholder = document.getElementById('puzzlePlaceholder');

var guessed = new Array();
var puzzle = null;

initHTML();

async function generateAndUpdate() {
  await generateNewPuzzle();
  updateHTML();
}

async function solveCustomLicense() {
  var custom_license = $('#license').val().toUpperCase();
  var data = {custom_license: custom_license}
  puzzle = await callAPI('/solvecustom', data);
  updateHTML();
}

function define(word) {
  url = 'https://www.dictionaryapi.com/api/v3/references/collegiate/json/voluminous?key=f52ea987-4e89-4af4-a94e-6aae3f5f78cc'
}

function checkGuess(guess) {
  var sol = puzzle.solution;
  
  console.log(puzzle)
  console.log(guess)

  if (!guessed.includes(guess) && sol.solution_type && sol.solutions.includes(guess)) {
      guessed.push(guess);
      var ul = document.getElementById("guess-list")
      var li = document.createElement('div');
      li.appendChild(document.createTextNode(guess));
      ul.appendChild(li);
  }
  $('#guess').val('');
}

function guessButton() {
  checkGuess($('#guess').val().toUpperCase());
}

function guessEnter(input) {
  if (event.key === 'Enter') {
    checkGuess(input.value.toUpperCase());
  }
}

function customEnter(input) {
  if (event.key === 'Enter') {
    solveCustomLicense(input.value.toUpperCase());
  }
}

async function initHTML() {
  var puzzlePromise = callAPI('/newpuzzle');

  document.getElementById('generate').addEventListener('click', generateAndUpdate, false);
  document.getElementById('solve').addEventListener('click', solveCustomLicense, false);
  document.getElementById('reveal-solutions').addEventListener('click', function() {
    if ( $('#solution-list').css('display') == 'none' || $('#solution-list').css("visibility") == "hidden") {
      $('#solution-list').show();
    } else {
      $('#solution-list').hide();
    }
  }, false);

  puzzle = await puzzlePromise;
  updateHTML();
}
  
function updateHTML() {
  puzzlePlaceholder.innerHTML = puzzleTemplate(puzzle);
  $('#license').val(puzzle.license);
  $('#guess').focus()
  $('#solution-list').hide();
}

async function generateNewPuzzle() {
  puzzle = await callAPI('/newpuzzle');
}

async function callAPI(url,data) {
  let response;
  try {
    response = await $.ajax({
      url: url,
      data: data
    });

    return response;
  } catch (err) {
    throw err;
  }
}















