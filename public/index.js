var puzzleHBSource = document.getElementById('puzzle-template').innerHTML,
    puzzleTemplate = Handlebars.compile(puzzleHBSource),
    puzzlePlaceholder = document.getElementById('puzzlePlaceholder');

var guessed = new Array();

initHTML();

async function generateAndUpdate() {
  var newPuzzle = await generateNewPuzzle();
  updateHTML(newPuzzle);
}

async function solveCustomLicense() {
  var custom_license = $('#license').val().toUpperCase();
  var data = {custom_license: custom_license}
  var solvedCustom = await callAPI('/solvecustom', data);
  console.log(solvedCustom)
  updateHTML(solvedCustom);
}

async function generateNewPuzzle() {
  return await callAPI('/newpuzzle');
}

async function getPuzzle() {
  return await callAPI('/puzzle');
}

async function checkGuess() {
  var puzzle = await getPuzzle();
  var sol = puzzle.solution;
  var guess = $('#guess').val().toUpperCase();
  
  console.log(puzzle)
  console.log(guess)

  if (!guessed.includes(guess) && sol.solution_type && sol.solutions.includes(guess)) {
      guessed.push(guess);
      var ul = document.getElementById("guess-list")
      var li = document.createElement('li');
      li.appendChild(document.createTextNode(guess));
      ul.appendChild(li);
  }
  $('#guess').val('');
}

async function initHTML() {
  var puzzlePromise = generateNewPuzzle();
  document.getElementById('generate').addEventListener('click', generateAndUpdate, false);
  document.getElementById('check-guess').addEventListener('click', checkGuess, false);
  document.getElementById('solve').addEventListener('click', solveCustomLicense, false);
  document.getElementById('reveal-solutions').addEventListener('click', function() {
    if ( $('#solution-list').css('display') == 'none' || $('#solution-list').css("visibility") == "hidden") {
      $('#solution-list').show();
    } else {
      $('#solution-list').hide();
    }
    
  }, false);

  updateHTML(await puzzlePromise);
}

function updateHTML(puzzle) {
  puzzlePlaceholder.innerHTML = puzzleTemplate(puzzle);
  $('#license').val(puzzle.license);
  $('#solution-list').hide();
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