const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);
const { puzzlesAndSolutions } = require("../controllers/puzzle-strings.js");
suite("Functional Tests", () => {
  // Solve a puzzle with valid puzzle string: POST request to /api/solve
  test("Solve a puzzle with valid puzzle string: POST request to /api/solve", (done) => {
    chai
      .request(server)
      .post("/api/solve")
      .send({
        puzzle: puzzlesAndSolutions[0][0],
      })
      .end((err, res) => {
        assert.equal(res.body.solution, puzzlesAndSolutions[0][1]);
        done();
      });
  });

  // Solve a puzzle with missing puzzle string: POST request to /api/solve
  test("Solve a puzzle with missing puzzle string: POST request to /api/solve", (done) => {
    chai
      .request(server)
      .post("/api/solve")
      .send({})
      .end((err, res) => {
        assert.equal(res.body.error, "Required field missing");
        done();
      });
  });
  // Solve a puzzle with invalid characters: POST request to /api/solve
  test("Solve a puzzle with invalid characters: POST request to /api/solve", (done) => {
    chai
      .request(server)
      .post("/api/solve")
      .send({
        puzzle: puzzlesAndSolutions[0][0].replace("1", "a"),
      })
      .end((err, res) => {
        assert.equal(res.body.error, "Invalid characters in puzzle");
        done();
      });
  });

  // Solve a puzzle with incorrect length: POST request to /api/solve
  test("Solve a puzzle with incorrect length: POST request to /api/solve", (done) => {
    chai
      .request(server)
      .post("/api/solve")
      .send({
        puzzle: puzzlesAndSolutions[0][0].slice(0, 80),
      })
      .end((err, res) => {
        assert.equal(
          res.body.error,
          "Expected puzzle to be 81 characters long"
        );
        done();
      });
  });
  // Solve a puzzle that cannot be solved: POST request to /api/solve
  test("Solve a puzzle that cannot be solved: POST request to /api/solve", (done) => {
    chai
      .request(server)
      .post("/api/solve")
      .send({
        puzzle:
          "..9..5.1.83.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
      })
      .end((err, res) => {
        assert.equal(res.body.error, "Puzzle cannot be solved");
        done();
      });
  });
  // Check a puzzle placement with all fields: POST request to /api/check
  test("Check a puzzle placement with all fields: POST request to /api/check", (done) => {
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle: puzzlesAndSolutions[0][0],
        coordinate: "A1",
        value: "7",
      })
      .end((err, res) => {
        assert.equal(res.body.valid, true);
        done();
      });
  });

  // Check a puzzle placement with single placement conflict: POST request to /api/check
  test("Check a puzzle placement with single placement conflict: POST request to /api/check", (done) => {
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle: puzzlesAndSolutions[0][0],
        coordinate: "A1",
        value: "5",
      })
      .end((err, res) => {
        assert.equal(res.body.valid, false);
        assert.equal(res.body.conflict[0], "row");
        done();
      });
  });

  // Check a puzzle placement with multiple placement conflicts: POST request to /api/check
  test("Check a puzzle placement with multiple placement conflicts: POST request to /api/check", (done) => {
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle: puzzlesAndSolutions[0][0],
        coordinate: "A1",
        value: "4",
      })
      .end((err, res) => {
        assert.equal(res.body.valid, false);
        assert.deepEqual(res.body.conflict, ["row", "column"]);

        done();
      });
  });

  // Check a puzzle placement with all placement conflicts: POST request to /api/check
  test("Check a puzzle placement with all placement conflicts: POST request to /api/check", (done) => {
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle: puzzlesAndSolutions[0][0],
        coordinate: "A1",
        value: "2",
      })
      .end((err, res) => {
        assert.equal(res.body.valid, false);
        assert.deepEqual(res.body.conflict, ["row", "column", "region"]);
        done();
      });
  });

  // Check a puzzle placement with missing required fields: POST request to /api/check
  test("Check a puzzle placement with missing required fields: POST request to /api/check", (done) => {
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle: puzzlesAndSolutions[0][0],
        coordinate: "A1",
      })
      .end((err, res) => {
        assert.equal(res.body.error, "Required field(s) missing");
        done();
      });
  });

  // Check a puzzle placement with invalid characters: POST request to /api/check
  test("Check a puzzle placement with invalid characters: POST request to /api/check", (done) => {
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle: puzzlesAndSolutions[0][0],
        coordinate: "A1",
        value: "a",
      })
      .end((err, res) => {
        assert.equal(res.body.error, "Invalid value");
        done();
      });
  });

  // Check a puzzle placement with incorrect length: POST request to /api/check
  test("Check a puzzle placement with incorrect length: POST request to /api/check", (done) => {
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle: puzzlesAndSolutions[0][0] + "1",
        coordinate: "A1",
        value: "1",
      })
      .end((err, res) => {
        assert.equal(
          res.body.error,
          "Expected puzzle to be 81 characters long"
        );
        done();
      });
  });

  // Check a puzzle placement with invalid placement coordinate: POST request to /api/check
  test("Check a puzzle placement with invalid placement coordinate: POST request to /api/check", (done) => {
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle: puzzlesAndSolutions[0][0],
        coordinate: "A10",
        value: "1",
      })
      .end((err, res) => {
        assert.equal(res.body.error, "Invalid coordinate");
        done();
      });
  });

  // Check a puzzle placement with invalid placement value: POST request to /api/check
  test("Check a puzzle placement with invalid placement value: POST request to /api/check", (done) => {
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle: puzzlesAndSolutions[0][0],
        coordinate: "A1",
        value: "10",
      })
      .end((err, res) => {
        assert.equal(res.body.error, "Invalid value");
        done();
      });
  });
});
