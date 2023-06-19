"use strict";

const { parse } = require("dotenv");
const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
  let solver = new SudokuSolver();

  const rowMap = {
    a: 0,
    b: 1,
    c: 2,
    d: 3,
    e: 4,
    f: 5,
    g: 6,
    h: 7,
    i: 8,
  };

  app.route("/api/check").post((req, res) => {
    // console.log(req.body);

    if (!req.body.puzzle || !req.body.coordinate || !req.body.value) {
      return res.json({ error: "Required field(s) missing" });
    }
    const letter = req.body.coordinate[0].toLowerCase();

    //get number after letter
    const number = req.body.coordinate.slice(1);
    // const number = req.body.coordinate[1];

    const parsedNumber = parseInt(number);
    const parsedLetter = rowMap[letter];
    const parsedValue = parseInt(req.body.value);

    //If the coordinate submitted to api/check does not point to an existing grid cell, the returned value will be { error: 'Invalid coordinate'}
    if (parsedNumber > 9 || parsedNumber < 1 || isNaN(parsedNumber)) {
      return res.json({ error: "Invalid coordinate" });
    }
    if (parsedLetter > 8 || parsedLetter < 0 || isNaN(parsedLetter)) {
      return res.json({ error: "Invalid coordinate" });
    }

    //if value is not a number between 1-9, return error
    if (parsedValue > 9 || parsedValue < 1 || isNaN(parsedValue)) {
      return res.json({ error: "Invalid value" });
    }

    const solverParams = [
      req.body.puzzle,
      parsedLetter,
      parsedNumber,
      parsedValue,
    ];

    //all of these should accept numbers except fro the puzzle as a whole
    const isValidRow = solver.checkRowPlacement(...solverParams);
    const isValidCol = solver.checkColPlacement(...solverParams);
    const isValidRegion = solver.checkRegionPlacement(...solverParams);

    if (solver.validate(req.body.puzzle).error) {
      return res.json(solver.validate(req.body.puzzle));
    }

    if (isValidRow && isValidCol && isValidRegion) {
      return res.json({ valid: true });
    }
    const conflict = [];
    if (!isValidRow) {
      conflict.push("row");
    }
    if (!isValidCol) {
      conflict.push("column");
    }
    if (!isValidRegion) {
      conflict.push("region");
    }
    return res.json({ valid: false, conflict });
  });

  app.route("/api/solve").post((req, res) => {
    const solved = solver.solve(req.body.puzzle);
    // console.log(req.body.puzzle);
    // console.log(solved);
  });
};
