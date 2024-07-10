'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const puzzle = req.body.puzzle
      const value = req.body.value
      const coordinate = req.body.coordinate
      if(!puzzle || !value || !coordinate){
        res.json({ error: "Required field(s) missing" })
        return;
      }
   
      //validate puzzle
      const validatePuzzleRes = solver.validate(puzzle)
      if (validatePuzzleRes!==true){
        res.json({error:validatePuzzleRes})
        return;
      }
      //validate value
      const validateValueRes = solver.validateVal(value)
      if(validateValueRes !== true){
        res.json({error:validateValueRes})
        return;
      }
      //validate coordinate
      const validateCoordinateRes = solver.validateCoordinates(coordinate)
      if(validateCoordinateRes!==true){
        res.json({ error: validateCoordinateRes })
        return;
      }
      //check
      const row = coordinate[0]
      const col = coordinate[1]
      const checkRowRes = solver.checkRowPlacement(puzzle,row,col,value)
      const checkColRes = solver.checkColPlacement(puzzle,row,col,value)
      const checkRegionRes = solver.checkRegionPlacement(puzzle,row,col,value)
      if(checkRowRes&&checkColRes&&checkRegionRes){
        res.json({valid:true})
        return;
      }else{
        const conflict = []
        checkRowRes?'':conflict.push('row')
        checkColRes?'':conflict.push('column')
        checkRegionRes?'':conflict.push('region')
        res.json({valid:false,conflict})
      }
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      const puzzle = req.body.puzzle
      if(!puzzle){
        res.json({ error: "Required field missing" })
        return;
      }
      //validate puzzle
      const validatePuzzleRes = solver.validate(puzzle)
      if(validatePuzzleRes!==true){
        res.json({error:validatePuzzleRes})
        return;
      }
      //solve it
      const solveRes = solver.solve(puzzle)
      if(solveRes === 'No solution exists'){
        res.json({ error: 'Puzzle cannot be solved' })
        return
      }
      res.json({solution:solveRes})
    });
};
