// const rowMap = {
//   a: 0,
//   b: 1,
//   c: 2,
//   d: 3,
//   e: 4,
//   f: 5,
//   g: 6,
//   h: 7,
//   i: 8,
// };

class SudokuSolver {
  validate(puzzleString) {
    const validChars = /^[1-9.]*$/;
    if (puzzleString.length !== 81) {
      return { error: "Expected puzzle to be 81 characters long" };
    }
    if (!validChars.test(puzzleString)) {
      return { error: "Invalid characters in puzzle" };
    }
    return true;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const rowStart = row * 9;
    const rowEnd = rowStart + 9;
    const rowValues = puzzleString.slice(rowStart, rowEnd);

    // console.log(rowValues, row);
    // console.log(!rowValues.includes(value));
    // console.log(+puzzleString[column - 1 + rowStart] === value);
    if (value === +puzzleString[column - 1 + rowStart]) {
      return true;
    }

    return !rowValues.includes(value);
  }

  checkColPlacement(puzzleString, row, column, value) {
    const colValues = [];

    for (let i = 0; i < 9; i++) {
      colValues.push(puzzleString[i * 9 + (column - 1)]);
    }

    if (value === +colValues[row]) {
      return true;
    }
    return !colValues.includes(value.toString());
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const regionRow = Math.floor(row / 3);
    const regionCol = Math.floor((column - 1) / 3);
    const regionValues = [];

    //use regionRow and regionCol to push values into regionValues
    for (let i = 0; i < 3; i++) {
      const rowStart = (regionRow * 3 + i) * 9 + regionCol * 3;
      const rowEnd = rowStart + 3;

      regionValues.push(...puzzleString.slice(rowStart, rowEnd));
    }

    console.log(regionValues, value);
    console.log(value === +regionValues[(row % 3) * 3 + ((column - 1) % 3)]);

    if (value === +regionValues[(row % 3) * 3 + ((column - 1) % 3)]) {
      return true;
    }

    return !regionValues.includes(value.toString());
  }

  solve(puzzleString) {
    //solve the puzzle
    const puzzle = puzzleString.split("");
    const solution = puzzleString.split("");
    const emptyCells = [];
    for (let i = 0; i < puzzle.length; i++) {
      if (puzzle[i] === ".") {
        emptyCells.push(i);
      }
    }
    let index = 0;
    while (index < emptyCells.length) {
      const cell = emptyCells[index];
      const row = Math.floor(cell / 9);
      const column = cell % 9;
      const value = solution[cell] === "." ? 1 : parseInt(solution[cell]) + 1;
      let found = false;
      while (!found && value < 10) {
        if (
          this.checkRowPlacement(puzzleString, row, column, value) &&
          this.checkColPlacement(puzzleString, row, column, value) &&
          this.checkRegionPlacement(puzzleString, row, column, value)
        ) {
          solution[cell] = value;
          found = true;
          index++;
        } else {
          value++;
        }
      }
      if (!found) {
        solution[cell] = ".";
        index--;
      }
    }
    return solution.join("");
  }
}

module.exports = SudokuSolver;
