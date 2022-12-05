# Advent of Code 2022

My solutions for [Advent of Code 2022](https://adventofcode.com/2022/) in TypeScript

## Stars

| Day |            Quest             | Part 1 | Part 2 |
| :-: | :--------------------------: | :----: | :----: |
|  1  |    [Calorie Counting][1]     | :star: | :star: |
|  2  |   [Rock Paper Scissors][2]   | :star: | :star: |
|  3  | [Rucksack Reorganization][3] | :star: | :star: |
|  4  |      [Camp Cleanup][4]       | :star: | :star: |
|  5  |      [Supply Stacks][5]      | :star: | :star: |

## Solutions

### Day 1: Calorie Counting

Quest: [adventofcode.com/2022/day/1](https://adventofcode.com/2022/day/1) <br>

```ts
import { add, desc, getLinesFromFile } from "../utils";

const lines = getLinesFromFile("./day-01/data.txt");
const elves: number[] = [0];

for (const line of lines) {
  if (line === "") {
    elves.unshift(0);
  } else {
    elves[0] += parseInt(line);
  }
}

elves.sort(desc);

console.log("Part 1:", elves[0]);
console.log("Part 2:", elves.slice(0, 3).reduce(add));
```

---

### Day 2: Rock Paper Scissors

Quest: [adventofcode.com/2022/day/2](https://adventofcode.com/2022/day/2) <br>

```ts
import { add, getLinesFromFile } from "../utils";

type Strategy = `${"A" | "B" | "C"}${"X" | "Y" | "Z"}`;
type PointsMap = Record<Strategy, number>;

const W = 6; // WIN
const D = 3; // DRAW
const L = 0; // LOSE

const X = 1; // A - ROCK
const Y = 2; // B - PAPER
const Z = 3; // C - SCISSORS

const strategies = getLinesFromFile("./day-02/data.txt").map(
  (line) => line.replace(" ", "") as Strategy
);

const pointsMap: PointsMap = {
  AX: D + X,
  AY: W + Y,
  AZ: L + Z,
  BX: L + X,
  BY: D + Y,
  BZ: W + Z,
  CX: W + X,
  CY: L + Y,
  CZ: D + Z,
};

console.log(
  "Part 1:",
  strategies.map((strategy) => pointsMap[strategy]).reduce(add)
);

const pointsMap2: PointsMap = {
  AX: L + Z,
  AY: D + X,
  AZ: W + Y,
  BX: L + X,
  BY: D + Y,
  BZ: W + Z,
  CX: L + Y,
  CY: D + Z,
  CZ: W + X,
};

console.log(
  "Part 2:",
  strategies.map((strategy) => pointsMap2[strategy]).reduce(add)
);
```

---

### Day 3: Rucksack Reorganization

Quest: [adventofcode.com/2022/day/3](https://adventofcode.com/2022/day/3) <br>

```ts
import { add, getLinesFromFile } from "../utils";
import { chunk, intersection } from "lodash";

const rucksacks = getLinesFromFile("./day-03/data.txt").map((x) => [...x]);

function itemToPriority(item: string) {
  const code = item.charCodeAt(0);
  return code - (code > 90 ? 96 : 38);
}

function commonItem(rucksacks: string[][]) {
  return intersection(...rucksacks)[0];
}

function divideRucksack(rucksack: string[]) {
  return chunk(rucksack, rucksack.length / 2);
}

const prioritySum = rucksacks
  .map(divideRucksack)
  .map(commonItem)
  .map(itemToPriority)
  .reduce(add);

console.log("part 1:", prioritySum);

const badgeSum = chunk(rucksacks, 3)
  .map(commonItem)
  .map(itemToPriority)
  .reduce(add);

console.log("part 2:", badgeSum);
```

---

### Day 4: Camp Cleanup

Quest: [adventofcode.com/2022/day/4](https://adventofcode.com/2022/day/4) <br>

```ts
import { intersection } from "lodash";
import { getLinesFromFile } from "../utils";

const pairs = getLinesFromFile("./day-04/data.txt").map((line) =>
  line.split(",").map((range) => range.split("-").map(Number))
);

function createRange([start, stop]: number[]) {
  const arr: number[] = new Array(stop - start + 1);
  for (let i = 0; i < arr.length; i++) arr[i] = start + i;
  return arr;
}

let fullyOverlapping = 0;
let anyOverlapping = 0;

for (const pair of pairs) {
  const ranges = pair.map(createRange);
  const overlaps = intersection(...ranges).length;
  const shorterAssignment = Math.min(...ranges.map((x) => x.length));
  if (overlaps === shorterAssignment) fullyOverlapping += 1;
  if (overlaps > 0) anyOverlapping += 1;
}

console.log("Part 1:", fullyOverlapping);
console.log("Part 2:", anyOverlapping);
```

---

### Day 5: Supply Stacks

Quest: [adventofcode.com/2022/day/5](https://adventofcode.com/2022/day/5) <br>

```ts
import { deepCopy, last, getLinesFromFile } from "../utils";

const CRATE_MOVER_9000 = "CrateMover 9000";
const CRATE_MOVER_9001 = "CrateMover 9001";
type Step = { move: number; from: number; to: number };

// Read file
const lines = getLinesFromFile("./day-05/input.txt", { trim: false });
const numberOfStacks = (lines[0].length + 1) / 4;
const heightOfStacks = lines.findIndex((line) => line[1] === "1");
const stacks: string[][] = new Array(numberOfStacks).fill(0).map(() => []);

for (let y = 0; y < heightOfStacks; y++) {
  for (let x = 0; x < numberOfStacks; x++) {
    const crate = lines[y][1 + x * 4];
    if (crate !== " ") stacks[x].unshift(crate);
  }
}

const steps: Step[] = lines.slice(heightOfStacks + 1).map((line) => {
  const [move, from, to] = line.match(/(\d+)/g)!.map(Number);
  return { move, from: from - 1, to: to - 1 };
});

// Part 1, 2:
const stacksPart2 = deepCopy(stacks);

function rearrange(stacks: string[][], step: Step, craneModel: string) {
  const crates = stacks[step.from].splice(-step.move);
  if (craneModel === CRATE_MOVER_9000) crates.reverse();
  stacks[step.to].push(...crates);
}

for (const step of steps) {
  rearrange(stacks, step, CRATE_MOVER_9000);
  rearrange(stacksPart2, step, CRATE_MOVER_9001);
}

console.log("Part 1:", stacks.map(last).join(""));
console.log("Part 2:", stacksPart2.map(last).join(""));
```

## How to run?

Install dependencies:

```shell
npm ci
```

Run solution:

```shell
npx ts-node day-<nr>/<file>.ts
```

[1]: #day-1-calorie-counting
[2]: #day-2-rock-paper-scissors
[3]: #day-3-rucksack-reorganization
[4]: #day-4-camp-cleanup
[5]: #day-5-supply-stacks
