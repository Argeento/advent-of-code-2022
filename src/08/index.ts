import { multiply } from 'lodash'
import { Cartesian } from '../Cartesian'
import { getArray2d } from '../utils'

const trees = new Cartesian(getArray2d(__dirname).map(line => line.map(Number)))

let maxScore = -Infinity
let visibleTrees = 0

trees.forEach((tree, x, y) => {
  const col = trees.cols[x]
  const row = trees.rows[y]

  const dirs = [
    col.slice(0, y).reverse(), // bottom
    col.slice(y + 1), // top
    row.slice(0, x).reverse(), // left
    row.slice(x + 1), // right
  ]

  const isVisible = dirs.some(dir => tree > Math.max(...dir))
  const scenicScore = dirs
    .map(dir => dir.findIndex(t => t >= tree) + 1 || dir.length)
    .reduce(multiply, 1)

  if (scenicScore > maxScore) maxScore = scenicScore
  if (isVisible) visibleTrees += 1
})

console.log('Part 1', visibleTrees)
console.log('Part 2', maxScore)
