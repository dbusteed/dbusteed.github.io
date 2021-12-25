const fs = require('fs')

const postsDir = './src/posts'
const hash = new RegExp('#', 'g');

let output = 'const posts = {\n'

fs.readdirSync(postsDir).forEach(file => {
  let content = fs.readFileSync(`${postsDir}/${file}`)
  let contentLines = content.toString().split('\n')
  let name = contentLines[1].trim()
  let date = Date.parse(contentLines[2].trim())
  let tags = contentLines[3].trim().split(',')
  let tagsStr = '[' + tags.map(t => `'${t}'`).join(', ') + ']'
  let link = file.substring(0, file.length-3)
  output += `  '${link}': {name: '${name}', date: '${date}', tags: ${tagsStr}},\n`
})

output += '}\n\nexport { posts }'

// console.log(output)
fs.writeFileSync('./src/data/posts.js', output)