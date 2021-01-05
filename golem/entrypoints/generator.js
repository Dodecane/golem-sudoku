const fs = require('fs')
const dlx = require('dancing-links')

function times (n, fn) {
  const returnValue = []
  for (let i = 0; i < n; i++) {
    returnValue.push(fn())
  }
  return returnValue
}

function product () {
  const args = Array.prototype.slice.call(arguments)
  return args.reduce(function tl (accumulator, value) {
    const tmp = []
    accumulator.forEach(function (a0) {
      value.forEach(function (a1) {
        tmp.push(a0.concat(a1))
      })
    })
    return tmp
  }, [[]])
}

function range (size, startAt = 0) {
  return [...Array(size).keys()].map(i => i + startAt)
}

function getRandomInt (min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min) + min) // The maximum is exclusive and the minimum is inclusive
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

function isUnique (grid) {
  const size = Math.sqrt(grid.length)
  const solution = dlx.findAll(generateSudokuConstraints(size, grid))
  if (solution.length > 1) {
    return false
  } else {
    return true
  }
}

function randomSprinkle (grid) {
  const size = Math.sqrt(grid.length)
  for (let box = 0; box < size; box++) {
    const x = getRandomInt(box * size, (box + 1) * size)
    const y = getRandomInt(box * size, (box + 1) * size)
    const n = getRandomInt(1, grid.length + 1)
    grid[x][y] = n
  }
  return grid
}

function generate (size, difficulty) {
  const n = size * size
  let grid = []
  for (let i = 0; i < n; i++) {
    const row = []
    for (let j = 0; j < n; j++) {
      row.push(0)
    }
    grid.push(row)
  }
  let remove = n * n
  switch (difficulty) {
    case 1:
      remove = Math.floor(remove * 0.25)
      break
    case 2:
      remove = Math.floor(remove * 0.5)
      break
    case 3:
      break
    default:
      remove = 0
  }
  grid = randomSprinkle(grid)
  const solution = dlx.findOne(generateSudokuConstraints(size, grid))
  solution.forEach(function (sol) {
    sol.forEach(function (value) {
      grid[value.data.rowIndex][value.data.colIndex] = value.data.number
    })
  })
  const answer = JSON.parse(JSON.stringify(grid))
  if (size <= 5) {
    const numbers = product(range(n), range(n))
    for (let i = remove; i > 0; i--) {
      const position = numbers[Math.floor(Math.random() * numbers.length)]
      const index = numbers.indexOf(position)
      if (index > -1) {
        numbers.splice(index, 1)
      }
      const gridCopy = JSON.parse(JSON.stringify(grid))
      gridCopy[position[0]][position[1]] = 0
      if (isUnique(gridCopy)) {
        grid = JSON.parse(JSON.stringify(gridCopy))
      }
    }
  } else {
    for (let i = 10; i > 0; i--) {
      const x = getRandomInt(0, n)
      const y = getRandomInt(0, n)
      if (grid[x][y] !== 0) {
        grid[x][y] = 0
      }
    }
  }
  const puzzle = {
    size: size,
    difficulty: difficulty,
    sudoku: grid,
    solution: answer
  }
  return puzzle
}

function readJSONAndSolve () {
  const input = JSON.parse(fs.readFileSync('/golem/work/input.json'))
  const output = generate(input.size, input.difficulty)
  fs.writeFileSync('/golem/output/output.json', JSON.stringify(output))
}

readJSONAndSolve()