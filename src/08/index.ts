import { getArray2dFromInput, getColumn, loop2d, multiply } from '../utils'

const trees = getArray2dFromInput(__dirname).map(line => line.map(Number))

function getTreeInfo(trees: number[][], x: number, y: number) {
  const column = getColumn(trees, x)
  const row = trees[y]
  const tree = trees[y][x]

  const dirs = [
    column.slice(0, y).reverse(),
    column.slice(y + 1),
    row.slice(0, x).reverse(),
    row.slice(x + 1),
  ]

  const isVisible = dirs.some(dir => tree > Math.max(...dir))
  const scenicScore = dirs
    .map(dir => dir.findIndex(t => t >= tree) + 1 || dir.length)
    .reduce(multiply, 1)

  return { scenicScore, isVisible }
}

let maxScore = -Infinity
let visibleTrees = 0

loop2d(trees, (x, y) => {
  const { scenicScore, isVisible } = getTreeInfo(trees, x, y)
  if (scenicScore > maxScore) maxScore = scenicScore
  if (isVisible) visibleTrees += 1
})

console.log('Part 1', visibleTrees)
console.log('Part 2', maxScore)
