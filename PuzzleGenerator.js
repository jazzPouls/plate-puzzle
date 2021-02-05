var fs = require('fs');

module.exports = function PuzzleGenerator() {
    this.puzzle = null;
    this.template = '1AAA111';
    var dict = '';
    fs.readFile(__dirname + '/public/dict/dictionary.txt', 'utf8', function(err, data) {
      if (err) throw err;
      dict = data
    });

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
        var res = dict.match(new RegExp(rgx, 'g'));
        var solution_type = 'strict';
        if (!res) {                                         // if not strict solution, allow leading characters
                                                            // e.g. XBM => EXHIBITIONISM
            var rgx_loose = '\\b\\w*' + license.replace(/[0-9]/g,'').replace(/(\w)/g,'$1\\w*') + '\\b';
            var res_loose = dict.match(new RegExp(rgx_loose, 'g'));
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

String.prototype.isletter = function() {
    return ((this >= 'A') && (this <= 'Z'));
}
String.prototype.isdigit = function() {
    return ((this >= '0') && (this <= '9'));
}
