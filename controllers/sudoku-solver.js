class SudokuSolver {
  makeSureIsDot(puzzleString,row,col){
    // Convert the puzzle string to a 2D array
    const grid = []
    for (let i = 0; i < 9; i++) {
      grid.push(puzzleString.slice(i * 9, (i + 1) * 9).split(""))
    }

    grid[row.charCodeAt(0)-97][col-1] = '.'
    return grid.flat().join('')
  }

  getRow(index) {
    if (index < 9) {
      return "a"
    } else if (index < 18) {
      return "b"
    } else if (index < 27) {
      return "c"
    } else if (index < 36) {
      return "d"
    } else if (index < 45) {
      return "e"
    } else if (index < 54) {
      return "f"
    } else if (index < 63) {
      return "g"
    } else if (index < 72) {
      return "h"
    } else if (index < 81) {
      return "i"
    } else {
      return "something went wrong"
    }
  }

  getCol(index) {
    return (index % 9) + 1
  }

  validateVal(value) {
    value = parseInt(value)
    const validVals = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    if (!validVals.includes(value)) {
      return "Invalid value"
    }
    return true
  }

  validateCoordinates(coordinate) {
    let row = coordinate[0].toLowerCase()
    let col = parseInt(coordinate[1])
    const validRowVals = ["a", "b", "c", "d", "e", "f", "g", "h", "i"]
    const validColVals = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    if (!validRowVals.includes(row) || !validColVals.includes(col) || coordinate.length != 2) {
      return "Invalid coordinate"
    }
    return true
  }

  validate(puzzleString) {
    if (puzzleString.length != 81) {
      return "Expected puzzle to be 81 characters long"
    } else if (!/[1-9.]{81}/.test(puzzleString)) {
      return "Invalid characters in puzzle"
    }
    return true
  }

  checkRowPlacement(puzzleString, row, column, value) {
    value = parseInt(value)
    column = parseInt(column)
    row = row.toLowerCase()

    puzzleString = this.makeSureIsDot(puzzleString,row,column)

    const ref = { a: 0, b: 9, c: 18, d: 27, e: 36, f: 45, g: 54, h: 63, i: 72 }
    let rowSlice = ""

    rowSlice = puzzleString.slice(ref[row], ref[row] + 9)

    return !rowSlice.includes(value)
  }

  checkColPlacement(puzzleString, row, column, value) {
    value = parseInt(value)
    column = parseInt(column)
    row = row.toLowerCase()

    puzzleString = this.makeSureIsDot(puzzleString, row, column)

    let columnSlice = ""
    for (let i = 0; i < 9; i++) {
      columnSlice = columnSlice + puzzleString[column - 1 + i * 9]
    }

    return !columnSlice.includes(value)
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    value = parseInt(value)
    column = parseInt(column)
    row = row.toLowerCase()

    puzzleString = this.makeSureIsDot(puzzleString, row, column)

    //get region and starting index
    const getRegion = (row, column) => {
      const checkRow = { abc: "123", def: "456", ghi: "789" }
      const possibleRegions = (row) => {
        for (const prop in checkRow) {
          if (prop.includes(row)) {
            return checkRow[prop]
          }
        }
      }

      const pr = possibleRegions(row)
      if (column <= 3) {
        return pr[0]
      } else if (column <= 6) {
        return pr[1]
      } else {
        return pr[2]
      }
    }

    const region = parseInt(getRegion(row, column))
    const getStartingIndex = (region) => {
      let result = ""
      const temp = [
        { 1: 0 },
        { 2: 3 },
        { 3: 6 },
        { 4: 27 },
        { 5: 30 },
        { 6: 33 },
        { 7: 54 },
        { 8: 57 },
        { 9: 60 },
      ]
      temp.forEach((obj) => {
        if (obj.hasOwnProperty(`${region}`)) {
          result = obj[`${region}`]
        }
      })
      return result
    }

    const startingIndex = getStartingIndex(region)

    let regionSlice = ""

    for (let i = startingIndex; i < startingIndex + 27; i += 9) {
      for (let j = i; j < i + 3; j++) {
        regionSlice = regionSlice + puzzleString[j]
      }
    }
    return !regionSlice.includes(value)
  }

  solve(puzzleString) {
    const res = this.validate(puzzleString)
    if(res !== true){
      return res
    }
    // Convert the puzzle string to a 2D array
    const grid = []
    for (let i = 0; i < 9; i++) {
      grid.push(puzzleString.slice(i * 9, (i + 1) * 9).split(""))
    }

    const isSafe = (grid, row, col, num) => {
      // Check if num is not in the current row, column and 3x3 sub-grid
      for (let x = 0; x < 9; x++) {
        if (grid[row][x] == num || grid[x][col] == num) {
          return false
        }
      }

      const startRow = row - (row % 3)
      const startCol = col - (col % 3)

      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (grid[i + startRow][j + startCol] == num) {
            return false
          }
        }
      }
      return true
    }

    const solve = (grid) => {
      let row = -1
      let col = -1
      let isEmpty = true

      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          if (grid[i][j] == ".") {
            row = i
            col = j
            isEmpty = false
            break
          }
        }
        if (!isEmpty) {
          break
        }
      }

      if (isEmpty) {
        return true
      }

      for (let num = 1; num <= 9; num++) {
        if (isSafe(grid, row, col, num.toString())) {
          grid[row][col] = num.toString()
          if (solve(grid)) {
            return true
          }
          grid[row][col] = "."
        }
      }
      return false
    }

    if (solve(grid)) {
      return grid.flat().join("")
    } else {
      return "No solution exists"
    }
  }
}

module.exports = SudokuSolver;

