const chai = require("chai");
const assert = chai.assert;

const Solver = require("../controllers/sudoku-solver.js");
let solver;

const { puzzlesAndSolutions } = require("../controllers/puzzle-strings.js");

suite("Unit Tests", () => {
  test("Logic handles a valid puzzle string of 81 characters", function (done) {
    const validPuzzle =
      "135762984946381257728459613694517832812936745357824196473298561581673429269145378";
    solver = new Solver(validPuzzle);
    assert.equal(solver.validate(validPuzzle), true);
    done();
  });

  test("Logic handles a puzzle string with invalid characters (not 1-9 or .)", function (done) {
    const invalidPuzzle =
      "13576298494638125772845961369451783281293674535782419647329856158167342926914537a";
    solver = new Solver(invalidPuzzle);
    assert.equal(
      solver.validate(invalidPuzzle).error,
      "Invalid characters in puzzle"
    );
    done();
  });

  test("Logic handles a puzzle string that is not 81 characters in length", function (done) {
    const invalidPuzzle =
      "1357629849463812577284596136945178328129367453578241964732985615816734292691453789";
    solver = new Solver(invalidPuzzle);
    assert.equal(
      solver.validate(invalidPuzzle).error,
      "Expected puzzle to be 81 characters long"
    );
    done();
  });

  test("Logic handles a valid row placement", function (done) {
    const validPuzzle = puzzlesAndSolutions[0][0];
    solver = new Solver(validPuzzle);
    assert.equal(solver.checkRowPlacement(validPuzzle, 0, 1, 1), true);
    done();
  });

  test("Logic handles an invalid row placement", function (done) {
    const validPuzzle = puzzlesAndSolutions[0][0];
    solver = new Solver(validPuzzle);
    assert.equal(solver.checkRowPlacement(validPuzzle, 0, 1, 5), false);
    done();
  });

  test("Logic handles a valid column placement", function (done) {
    const validPuzzle = puzzlesAndSolutions[0][0];
    solver = new Solver(validPuzzle);
    assert.equal(solver.checkColPlacement(validPuzzle, 0, 1, 1), true);
    done();
  });

  test("Logic handles an invalid column placement", function (done) {
    const validPuzzle = puzzlesAndSolutions[0][0];
    solver = new Solver(validPuzzle);
    assert.equal(solver.checkColPlacement(validPuzzle, 0, 1, 8), false);
    done();
  });

  test("Logic handles a valid region (3x3 grid) placement", function (done) {
    const validPuzzle = puzzlesAndSolutions[0][0];
    solver = new Solver(validPuzzle);
    assert.equal(solver.checkRegionPlacement(validPuzzle, 0, 1, 1), true);
    done();
  });

  test("Logic handles an invalid region (3x3 grid) placement", function (done) {
    const validPuzzle = puzzlesAndSolutions[0][0];
    solver = new Solver(validPuzzle);
    assert.equal(solver.checkRegionPlacement(validPuzzle, 0, 1, 5), false);
    done();
  });

  test("Valid puzzle strings pass the solver", function (done) {
    const validPuzzle = puzzlesAndSolutions[0][0];
    solver = new Solver(validPuzzle);
    assert.equal(solver.solve(validPuzzle), puzzlesAndSolutions[0][1]);
    done();
  });

  test("Invalid puzzle strings fail the solver", function (done) {
    const invalidPuzzle =
      "..9..5.1.83.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    solver = new Solver(invalidPuzzle);
    assert.equal(solver.solve(invalidPuzzle), false);
    done();
  });

  test("Solver returns the expected solution for an incomplete puzzle", function (done) {
    const validPuzzle = puzzlesAndSolutions[0][0];
    solver = new Solver(validPuzzle);
    assert.equal(solver.solve(validPuzzle), puzzlesAndSolutions[0][1]);
    done();
  });
});
