const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');
const {puzzlesAndSolutions} = require('../controllers/puzzle-strings')

chai.use(chaiHttp);

suite('Functional Tests', () => {
    test('test1: Solve a puzzle with valid puzzle string: POST request to /api/solve',()=>{
        let puzzle = puzzlesAndSolutions[0][0]
        let solution = puzzlesAndSolutions[0][1]
        chai.request(server)
        .post('/api/solve')
        .send({puzzle})
        .end((err,res)=>{
            assert.equal(res.status, 200)
            assert.equal(res.type, 'application/json')
            assert.equal(res.body.solution, solution)
        })
    })

    test("test2: Solve a puzzle with missing puzzle string: POST request to /api/solve", () => {
      chai
        .request(server)
        .post("/api/solve")
        .send({ puzzle:'' })
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.equal(res.type, "application/json")
          assert.equal(res.body.error, "Required field missing")
        })
    })

    test("test3: Solve a puzzle with invalid characters: POST request to /api/solve", () => {
      let puzzle = puzzlesAndSolutions[0][0].split('')
      puzzle[0] = 's'
      puzzle = puzzle.join('')
      chai
        .request(server)
        .post("/api/solve")
        .send({ puzzle })
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.equal(res.type, "application/json")
          assert.equal(res.body.error, "Invalid characters in puzzle")
        })
    })

    test("test4: Solve a puzzle with incorrect length: POST request to /api/solve", () => {
      let puzzle = puzzlesAndSolutions[0][0] + '1'
      chai
        .request(server)
        .post("/api/solve")
        .send({ puzzle })
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.equal(res.type, "application/json")
          assert.equal(res.body.error, "Expected puzzle to be 81 characters long")
        })
    })

    test("test5: Solve a puzzle that cannot be solved: POST request to /api/solve", () => {
      let puzzle = puzzlesAndSolutions[0][0].split('')
      puzzle[0] = '5'
      puzzle = puzzle.join('')
      chai
        .request(server)
        .post("/api/solve")
        .send({ puzzle })
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.equal(res.type, "application/json")
          assert.equal(res.body.error, "Puzzle cannot be solved")
        })
    })

    test("test6: Check a puzzle placement with all fields: POST request to /api/check", () => {
      let puzzle = puzzlesAndSolutions[0][0]
      chai
        .request(server)
        .post("/api/check")
        .send({ puzzle,coordinate:'a2',value:3 })
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.equal(res.type, "application/json")
          assert.equal(res.body.valid, true)
        })
    })

    test("test7: Check a puzzle placement with single placement conflict: POST request to /api/check", () => {
      let puzzle = puzzlesAndSolutions[0][0]
      chai
        .request(server)
        .post("/api/check")
        .send({ puzzle, coordinate: "a2", value: 9 })
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.equal(res.type, "application/json")
          assert.equal(res.body.valid, false)
          assert.equal(res.body.conflict.length, 1)
          assert.equal(res.body.conflict[0], 'column')
        })
    })

    test("test8: Check a puzzle placement with multiple placement conflicts: POST request to /api/check", () => {
      let puzzle = puzzlesAndSolutions[0][0]
      chai
        .request(server)
        .post("/api/check")
        .send({ puzzle, coordinate: "a2", value: 1 })
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.equal(res.type, "application/json")
          assert.equal(res.body.valid, false)
          assert.equal(res.body.conflict.length, 2)
          assert.equal(res.body.conflict[0], "row")
          assert.equal(res.body.conflict[1], "region")
        })
    })

    test("test9: Check a puzzle placement with all placement conflicts: POST request to /api/check", () => {
      let puzzle = puzzlesAndSolutions[0][0]
      chai
        .request(server)
        .post("/api/check")
        .send({ puzzle, coordinate: "a2", value: 2 })
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.equal(res.type, "application/json")
          assert.equal(res.body.valid, false)
          assert.equal(res.body.conflict.length, 3)
          assert.equal(res.body.conflict[0], "row")
          assert.equal(res.body.conflict[1], "column")
          assert.equal(res.body.conflict[2], "region")
        })
    })

    test("test10: Check a puzzle placement with missing required fields: POST request to /api/check", () => {
      chai
        .request(server)
        .post("/api/check")
        .send({ puzzle:'', coordinate: "", value: '' })
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.equal(res.type, "application/json")
          assert.equal(res.body.error, "Required field(s) missing")
        })
    })

    test("test11: Check a puzzle placement with invalid characters: POST request to /api/check", () => {
      let puzzle = puzzlesAndSolutions[0][0].split('')
      puzzle[0] = 's'
      puzzle = puzzle.join('')
      chai
        .request(server)
        .post("/api/check")
        .send({ puzzle, coordinate: 'a2', value: 3 })
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.equal(res.type, "application/json")
          assert.equal(res.body.error, "Invalid characters in puzzle")
        })
    })

    test("test12: Check a puzzle placement with incorrect length: POST request to /api/check", () => {
      let puzzle = puzzlesAndSolutions[0][0] + '1'
      chai
        .request(server)
        .post("/api/check")
        .send({ puzzle, coordinate: "a2", value: 3 })
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.equal(res.type, "application/json")
          assert.equal(res.body.error, "Expected puzzle to be 81 characters long")
        })
    })

    test("test13: Check a puzzle placement with invalid placement coordinate: POST request to /api/check", () => {
      let puzzle = puzzlesAndSolutions[0][0]
      chai
        .request(server)
        .post("/api/check")
        .send({ puzzle, coordinate: "s2", value: 3 })
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.equal(res.type, "application/json")
          assert.equal(res.body.error, "Invalid coordinate")
        })
    })

    test("test14: Check a puzzle placement with invalid placement value: POST request to /api/check", () => {
      let puzzle = puzzlesAndSolutions[0][0]
      chai
        .request(server)
        .post("/api/check")
        .send({ puzzle, coordinate: "a2", value: 10 })
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.equal(res.type, "application/json")
          assert.equal(res.body.error, "Invalid value")
        })
    })
});

