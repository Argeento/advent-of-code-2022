import { add, multiply } from 'lodash'
import { desc, getLines, toKeys, toNumbers } from '../utils'

const blueprints = getLines(__dirname)
  .map(toNumbers)
  .map(
    toKeys(
      'id',
      'oreRobotOreCost',
      'clayRobotOreCost',
      'obsidianRobotOreCost',
      'obsidianRobotClayCost',
      'geodeRobotOreCost',
      'geodeRobotObsidianCost'
    )
  )

type Blueprint = typeof blueprints[number]

function createState() {
  return {
    ore: 0,
    oreRobots: 1,
    clay: 0,
    clayRobots: 0,
    obsidian: 0,
    obsidianRobots: 0,
    geode: 0,
    geodeRobots: 0,
    waiting: 0,
  }
}

type State = Readonly<ReturnType<typeof createState>>
type RealitiesMap = Record<string, boolean>

function tick(
  state: State,
  print: Blueprint,
  minute: number,
  realitiesMap: RealitiesMap
): State[] {
  if (minute > 20 && state.clayRobots === 0) return []
  if (minute > 25 && state.obsidianRobots === 0) return []

  if (state.oreRobots > 20) return []
  if (state.clayRobots > 20) return []

  const possibleStates: State[] = []
  const newState: State = {
    ...state,
    ore: state.ore + state.oreRobots,
    clay: state.clay + state.clayRobots,
    obsidian: state.obsidian + state.obsidianRobots,
    geode: state.geode + state.geodeRobots,
    waiting: state.waiting + 1,
  }

  if (
    state.ore >= print.geodeRobotOreCost &&
    state.obsidian >= print.geodeRobotObsidianCost
  ) {
    const tmp: State = {
      ...newState,
      ore: newState.ore - print.geodeRobotOreCost,
      obsidian: newState.obsidian - print.geodeRobotObsidianCost,
      geodeRobots: newState.geodeRobots + 1,
      waiting: 0,
    }

    const json = JSON.stringify(tmp)
    if (!realitiesMap[json]) {
      realitiesMap[json] = true
      possibleStates.push(tmp)
    }

    return possibleStates
  }

  if (
    state.ore >= print.obsidianRobotOreCost &&
    state.clay >= print.obsidianRobotClayCost
  ) {
    const tmp: State = {
      ...newState,
      ore: newState.ore - print.obsidianRobotOreCost,
      clay: newState.clay - print.obsidianRobotClayCost,
      obsidianRobots: newState.obsidianRobots + 1,
      waiting: 0,
    }

    const json = JSON.stringify(tmp)
    if (!realitiesMap[json]) {
      realitiesMap[json] = true
      possibleStates.push(tmp)
    }

    return possibleStates
  }

  if (newState.waiting < 6) {
    const json = JSON.stringify(newState)
    if (!realitiesMap[json]) {
      realitiesMap[json] = true
      possibleStates.push({ ...newState })
    }
  } else {
    return []
  }

  if (state.ore >= print.clayRobotOreCost) {
    const tmp: State = {
      ...newState,
      ore: newState.ore - print.clayRobotOreCost,
      clayRobots: newState.clayRobots + 1,
      waiting: 0,
    }

    const json = JSON.stringify(tmp)
    if (!realitiesMap[json]) {
      realitiesMap[json] = true
      possibleStates.push(tmp)
    }
  }

  if (state.ore >= print.oreRobotOreCost) {
    const tmp: State = {
      ...newState,
      ore: newState.ore - print.oreRobotOreCost,
      oreRobots: newState.oreRobots + 1,
      waiting: 0,
    }
    const json = JSON.stringify(tmp)
    if (!realitiesMap[json]) {
      realitiesMap[json] = true
      possibleStates.push(tmp)
    }
  }

  return possibleStates
}

function getMaxGeodes(blueprint: Blueprint, time: number) {
  let realities: State[] = [createState()]
  const realitiesMap: RealitiesMap = {}

  for (let minute = 1; minute <= time; minute++) {
    realities = realities.flatMap(state =>
      tick(state, blueprint, minute, realitiesMap)
    )
  }

  return realities.sort((a, b) => desc(a.geode, b.geode))[0].geode
}

const p1Sum = blueprints
  .map(blueprint => blueprint.id * getMaxGeodes(blueprint, 24))
  .reduce(add)

const p2Product = blueprints
  .slice(0, 3)
  .map(blueprint => getMaxGeodes(blueprint, 32))
  .reduce(multiply, 1)

console.log('Part 1:', p1Sum)
console.log('Part 2:', p2Product)
