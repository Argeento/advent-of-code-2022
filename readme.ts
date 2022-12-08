import fs from 'fs'
import path from 'path'
import createTable from 'markdown-table'
import prettier from 'prettier'

const days = fs
  .readdirSync(path.join(__dirname, 'src'))
  .filter(dir => /\d+/.test(dir))
  .map(dir => path.join(__dirname, 'src', dir))
  .map((dir, index) => {
    const story = fs.readFileSync(path.join(dir, 'story.txt')).toString()
    const code = fs.readFileSync(path.join(dir, 'index.ts')).toString()
    const [title, content] = story.split('\n---\n')
    return { title, content, code, nr: index + 1 }
  })

const fileContent = `# Advent of Code 2022
My solutions for [Advent of Code 2022](https://adventofcode.com/2022/) in TypeScript

## Story

Santa's reindeer typically eat regular reindeer food, but they need a lot of magical energy to deliver presents on Christmas. For that, their favorite snack is a special type of **star fruit** that only grows deep in the jungle. The Elves have brought you on their annual expedition to the grove where the fruit grows.

To supply enough magical energy, the expedition needs to retrieve a minimum of fifty stars by December 25th. Although the Elves assure you that the grove has plenty of fruit, you decide to grab any fruit you see along the way, just in case.

## Star fruits
${createTable(
  [
    ['Day', 'Quest', 'Part 1', 'Part 2'],
    ...days.map(story => [
      story.nr.toString(),
      `[${story.title}][${story.nr}]`,
      ':star:',
      ':star:',
    ]),
  ],
  { align: ['c', 'c', 'c', 'c'] }
)}

## The journey

${days
  .map(
    day => `
### Day ${day.nr}: ${day.title}

${day.content}

<img width="270" alt="" src="https://github.com/Argeento/advent-of-code-2022/blob/main/src/${day.nr
      .toString()
      .padStart(2, '0')}/story.png">

Quest: [adventofcode.com/2022/day/${
      day.nr
    }](https://adventofcode.com/2022/day/${day.nr})

#### Solution
\`\`\`ts
${day.code}
\`\`\`

---
`
  )
  .join('\n')}

## How to run?
Requirements:
\`\`\`
node ${fs.readFileSync(path.join(__dirname, '.nvmrc').toString().trim())}\`\`\`

Install dependencies:
\`\`\`shell
npm ci
\`\`\`

Run solution:
\`\`\`shell
npx ts-node src/<nr>/index.ts
\`\`\`

Generate \`README.md\`:
\`\`\`shell
npm run readme
\`\`\`


## Story illustrations
[Midjourney](https://twitter.com/midjourney) and [DALL-E](https://openai.com/dall-e-2/)


## Thanks to the AoC team
Puzzles, Code, & Design: [Eric Wastl](https://twitter.com/ericwastl)

Beta Testing:
- [Tim Giannetti](https://twitter.com/Sr_Giannetti)
- Ben Lucek
- [JP Burke](https://twitter.com/yatpay)
- [Aneurysm9](https://twitter.com/Aneurysm9)
- Andrew Skalski

Community Managers: [Danielle Lucek](https://reddit.com/message/compose/?to=/r/adventofcode) and [Aneurysm9](https://twitter.com/Aneurysm9)

${days
  .map(
    day =>
      `[${day.nr}]: #day-${day.nr}-${day.title
        .toLowerCase()
        .replace(/ /g, '-')}`
  )
  .join('\n')}
`

prettier.resolveConfig(__dirname).then(prettierConfig => {
  fs.writeFileSync(
    path.join(__dirname, './README.md'),
    prettier.format(fileContent, {
      parser: 'markdown',
      ...prettierConfig,
    })
  )

  console.log('Done')
})
