const fs = require('fs')
const axios = require('axios')
const createTable = require('markdown-table')
const dayNr = parseInt(process.argv[2])
const prettier = require('prettier')

axios(`https://adventofcode.com/2022/day/${dayNr}`).then(res => {
  const title = res.data.match(/--- Day \d*: (.*) ---/)[1]
  fs.appendFileSync('./puzzle-names.txt', `${title}\n`)

  const puzzleNames = fs
    .readFileSync('./puzzle-names.txt')
    .toString()
    .split('\n')
    .slice(0, -1)

  const table = createTable(
    [
      ['Day', 'Quest', 'Part 1', 'Part 2'],
      ...puzzleNames.map((title, index) => [
        index + 1,
        `[${title}][${index + 1}]`,
        ':star:',
        ':star:',
      ]),
    ],
    { align: ['c', 'c', 'c', 'c'] }
  )

  const codes = puzzleNames.map((title, index) => {
    const dayNr = index + 1
    const code = fs
      .readFileSync(`./day-${dayNr.toString().padStart(2, '0')}/index.ts`)
      .toString()

    return `
### Day ${dayNr}: ${title}

Quest: [adventofcode.com/2022/day/${dayNr}](https://adventofcode.com/2022/day/${dayNr}) <br>

\`\`\`ts
${code}
\`\`\``
  })

  console.log(table)

  const links = []
  for (let i = 1; i <= dayNr; i++) {
    links.push(
      `[${i}]: #day-${i}-${puzzleNames[i - 1].toLowerCase().replace(/ /g, '-')}`
    )
  }

  const fileContent = `# Advent of Code 2022
My solutions for [Advent of Code 2022](https://adventofcode.com/2022/) in TypeScript
## Stars
${table}
## Solutions
${codes.join('\n ---')}
## How to run?
Install dependencies:
\`\`\`shell
npm ci
\`\`\`
Run solution:
\`\`\`shell
npx ts-node day-<nr>/index.ts
\`\`\`
${links.join('\n')}
`

  fs.writeFileSync(
    './README.md',
    prettier.format(fileContent, {
      parser: 'markdown',
      singleQuote: true,
      arrowParens: 'avoid',
      semi: false,
    })
  )
})
