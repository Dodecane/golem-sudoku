const fs = require('fs')
const dlx = require('dancing-links')

function times (n, fn) {
  const returnValue = []
  for (let i = 0; i < n; i++) {
    returnValue.push(fn())
  }
  return returnValue
}

function generateSudokuConstraints (blockSize, grid) {
  const size = blockSize * blockSize
  const numRowColConstraints = size * size
  const numRowConstraints = size * size
  const numColConstraints = size * size
  const numBlockConstraints = size * size
  const constraints = []
  const allIndexes = []
  for (let currentRow = 0; currentRow < size; currentRow++) {
    for (let currentCol = 0; currentCol < size; currentCol++) {
      const gridInput = grid[currentRow][currentCol]
      for (let currentNumber = 0; currentNumber < size; currentNumber++) {
        if (gridInput !== 0) {
          if (gridInput !== currentNumber + 1) {
            continue
          }
        }
        const numberOffset = (currentNumber * size)
        const rowColNumber = size * currentRow + currentCol
        const rowColIndex = rowColNumber
        const rowIndex = numRowColConstraints + numberOffset + currentRow
        const colIndex = numRowColConstraints + numRowConstraints + numberOffset + currentCol
        const blockRow = Math.floor(currentRow / blockSize)
        const blockCol = Math.floor(currentCol / blockSize)
        const blockNumber = blockSize * blockRow + blockCol
        const blockIndex = numRowColConstraints + numRowConstraints + numColConstraints + (numberOffset + blockNumber)
        const row = times(numRowColConstraints + numRowConstraints + numColConstraints + numBlockConstraints, () => 0)
        row[rowColIndex] = 1
        row[rowIndex] = 1
        row[colIndex] = 1
        row[blockIndex] = 1
        allIndexes[rowColIndex] = 1
        allIndexes[rowIndex] = 1
        allIndexes[colIndex] = 1
        allIndexes[blockIndex] = 1
        constraints.push({
          row: row,
          coveredColumns: [rowColIndex, rowIndex, colIndex, blockIndex],
          data: {
            number: currentNumber + 1,
            rowIndex: currentRow,
            colIndex: currentCol
          }
        })
      }
    }
  }
  return constraints
}

function readJSONAndSolve () {
  const input = JSON.parse(fs.readFileSync('/golem/work/input.json'))
  const solution = dlx.findOne(generateSudokuConstraints(input.size, input.grid))
  const output = {
    solved: false,
    solutions: []
  }
  solution.forEach(function (sol) {
    output.solved = true
    const grid = input.grid
    sol.forEach(function (value) {
      grid[value.data.rowIndex][value.data.colIndex] = value.data.number
    })
    output.solutions.push(grid)
  })
  fs.writeFileSync('/golem/output/output.json', JSON.stringify(output))
}

readJSONAndSolve()