export type Cycle<T> = {
  startIndex: number
  repeats: number
  elements: T[]
  length: number
  left: number
  rate: number
}

export type Options = {
  minCycleLength?: number
  minRepeats?: number
  maxRepeats?: number
}

export function findCycles<T>(arr: T[], options: Options = {}): Cycle<T>[] {
  options.minCycleLength ??= 1
  options.minRepeats ??= 2
  options.maxRepeats ??= Infinity

  const cycles: Cycle<T>[] = []
  for (let startIndex = 0; startIndex < arr.length; startIndex++) {
    for (
      let endIndex = startIndex + options.minCycleLength;
      endIndex < arr.length;
      endIndex++
    ) {
      if (arr[startIndex] !== arr[endIndex]) continue

      const cycle = arr.slice(startIndex, endIndex)
      let nextCycle: T[] = []
      let repeats = 0

      do {
        nextCycle = arr.slice(
          repeats * cycle.length + endIndex,
          (repeats + 1) * cycle.length + endIndex
        )
        repeats += 1
        if (repeats > options.maxRepeats) {
          break
        }
      } while (arrEqual(cycle, nextCycle))

      if (repeats >= options.minRepeats && repeats <= options.maxRepeats) {
        const left = arr.length - startIndex - cycle.length * repeats
        cycles.push({
          startIndex,
          repeats,
          elements: cycle,
          length: cycle.length,
          left,
          rate: (arr.length - left - startIndex) * cycle.length,
        })
      }
    }
  }
  return cycles.sort((a, b) => b.rate - a.rate)
}

function arrEqual<T>(arr: T[], arr2: T[]): boolean {
  if (arr.length !== arr2.length) return false

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] !== arr2[i]) return false
  }

  return true
}
