import { getLines, toNumber } from '../utils'
import Graph from 'node-dijkstra'
import combinations from 'combinations'
import memoizee from 'memoizee'

console.time('time')

type Costs = Record<string, Record<string, number>>
type Valve = {
  name: string
  flow: number
  tunnels: string[]
}

const flowRateMap: Record<string, number> = {}
const valves = getLines(__dirname).map(line => {
  const [name, ...tunnels] = line.match(/[A-Z]{2}/g)!
  const flow = toNumber(line)
  flowRateMap[name] = flow
  return { name, flow, tunnels }
})

const tunnelsRoute = new Graph()
valves.forEach(valve => {
  const edges = valve.tunnels.reduce(
    (obj, tunnel) => ({ ...obj, [tunnel]: 1 }),
    {}
  )
  tunnelsRoute.addNode(valve.name, edges)
})

const aaValve = valves.find(valve => valve.name === 'AA')!
const everyFlowValve = valves.filter(valve => valve.flow)
const getPathWeight = memoizee((from: string, to: string) => {
  const path = tunnelsRoute.path(from, to) as string[]
  return path.length - 1
})

function createCosts(valves: Valve[]) {
  valves = [aaValve, ...valves]
  const costs: Record<string, Record<string, number>> = {}

  for (let i = 0; i < valves.length; i++) {
    const from = valves[i]
    const restValves = valves.filter(v => v !== from)
    for (const to of restValves) {
      costs[from.name] ??= {}
      costs[from.name][to.name] = getPathWeight(from.name, to.name)
    }
  }

  return costs
}

function best(
  costs: Costs,
  time: number,
  current: string = 'AA',
  open: string[] = []
): number {
  if (time === 0) return 0

  const results = Object.keys(costs[current])
    .filter(destination => {
      return !open.includes(destination) && time > costs[current][destination]
    })
    .map(dest => {
      const remaining = time - costs[current][dest] - 1
      const pressure = remaining * flowRateMap[dest]
      return pressure + best(costs, remaining, dest, [dest, ...open])
    })

  return Math.max(0, ...results)
}

const p1Costs = createCosts(everyFlowValve)
console.log('Part 1:', best(p1Costs, 30))
console.timeLog('time')

const allPerm = combinations(everyFlowValve, 3, everyFlowValve.length / 2)
let max = -Infinity
for (const player of allPerm) {
  const elephant = everyFlowValve.filter(valve => !player.includes(valve))
  const sum = best(createCosts(player), 26) + best(createCosts(elephant), 26)
  if (sum > max) {
    max = sum
  }
}

console.log('Part 2:', max)
console.timeEnd('time')
