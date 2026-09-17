const fs = require('node:fs')
const path = require('node:path')

// Payload 3.82.1's BlocksFeature dereferences an optional schema entry while
// Lexical fields are mounted during admin SPA navigation. When that entry is
// temporarily absent, the complete rich-text field crashes and disappears.
// Keep this install-time patch until the upstream access is null-safe.
const packageRoot = path.dirname(path.dirname(require.resolve('@payloadcms/richtext-lexical')))

const files = [
  'dist/features/blocks/client/component/index.js',
  'dist/features/blocks/client/componentInline/index.js',
  'dist/exports/client/index.js',
  'dist/exports/client/chunk-2S5Q7QYO.js',
]

let replacements = 0

for (const relativePath of files) {
  const filePath = path.join(packageRoot, relativePath)

  if (!fs.existsSync(filePath)) {
    throw new Error(`Payload Lexical patch target is missing: ${relativePath}`)
  }

  const source = fs.readFileSync(filePath, 'utf8')
  const patched = source
    .replaceAll('blocksField.blockReferences', 'blocksField?.blockReferences')
    .replace(
      /([A-Za-z_$][\w$]*)\.blockReferences\?typeof/g,
      '$1?.blockReferences?typeof',
    )

  if (patched !== source) {
    replacements += 1
    fs.writeFileSync(filePath, patched)
  }
}

console.log(
  replacements > 0
    ? `Patched Payload Lexical block rendering in ${replacements} files.`
    : 'Payload Lexical block rendering patch is already applied.',
)
