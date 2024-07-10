const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver()
const puzzlesAndSolutions = require('../controllers/puzzle-strings.js').puzzlesAndSolutions

suite('Unit Tests', () => {
    test("test1: Logic handles a valid puzzle string of 81 characters",()=>{
        let puzzle = puzzlesAndSolutions[0][0]
        assert.strictEqual(solver.validate(puzzle),true)
    })

    test("test2: Logic handles a puzzle string with invalid characters (not 1-9 or .)", () => {
      let puzzle = puzzlesAndSolutions[0][0].split('')
      puzzle[0] = 's'
      puzzle = puzzle.join('')
      assert.strictEqual(solver.validate(puzzle), 'Invalid characters in puzzle')
    })

    test("test3: Logic handles a puzzle string that is not 81 characters in length", () => {
      let puzzle = puzzlesAndSolutions[0][0] + '1'
      assert.strictEqual(solver.validate(puzzle), 'Expected puzzle to be 81 characters long')
    })

    test("test4: Logic handles a valid row placement", () => {
      let puzzle = puzzlesAndSolutions[0][0]
      assert.strictEqual(solver.checkRowPlacement(puzzle,'a',2,3),true)
    })

    test("test5: Logic handles an invalid row placement", () => {
      let puzzle = puzzlesAndSolutions[0][0]
      assert.strictEqual(solver.checkRowPlacement(puzzle, "a", 2, 1), false)
    })

    test("test6: Logic handles a valid column placement", () => {
      let puzzle = puzzlesAndSolutions[0][0]
      assert.strictEqual(solver.checkColPlacement(puzzle, "a", 2, 3), true)
    })

    test("test7: Logic handles an invalid column placement", () => {
      let puzzle = puzzlesAndSolutions[0][0]
      assert.strictEqual(solver.checkColPlacement(puzzle, "a", 2, 2), false)
    })

    test("test8: Logic handles a valid region (3x3 grid) placement", () => {
      let puzzle = puzzlesAndSolutions[0][0]
      assert.strictEqual(solver.checkRegionPlacement(puzzle, "a", 2, 3), true)
    })

    test("test9: Logic handles an invalid region (3x3 grid) placement", () => {
      let puzzle = puzzlesAndSolutions[0][0]
      assert.strictEqual(solver.checkRegionPlacement(puzzle, "a", 2, 5), false)
    })

    test("test10: Valid puzzle strings pass the solver", () => {
      let puzzle = puzzlesAndSolutions[0][0]
      let solution = puzzlesAndSolutions[0][1]
      assert.strictEqual(solver.solve(puzzle), solution)
    })

    test("test11: Invalid puzzle strings fail the solver", () => {
      let puzzle = puzzlesAndSolutions[0][0] + '1'
      assert.strictEqual(solver.solve(puzzle), 'Expected puzzle to be 81 characters long')
    })

    test("test12: Solver returns the expected solution for an incomplete puzzle", () => {
      let puzzle = puzzlesAndSolutions[0][0].slice(0,-1)
      assert.strictEqual(solver.solve(puzzle), 'Expected puzzle to be 81 characters long')
    })
});
