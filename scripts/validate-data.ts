import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { z } from 'zod'
import { PhaseSchema, ModelSchema, ToolSchema } from './schema.ts'

function loadJson(filename: string): unknown {
  return JSON.parse(readFileSync(join('src', 'data', filename), 'utf-8'))
}

const checks = [
  { name: 'phases.json', schema: z.array(PhaseSchema), data: loadJson('phases.json') },
  { name: 'models.json', schema: z.array(ModelSchema), data: loadJson('models.json') },
  { name: 'tools.json', schema: z.array(ToolSchema), data: loadJson('tools.json') },
] as const

let failed = false

for (const { name, schema, data } of checks) {
  const result = schema.safeParse(data)
  if (result.success) {
    console.log(`✓ ${name} (${result.data.length} entries)`)
  } else {
    console.error(`✗ ${name}`)
    for (const issue of result.error.issues) {
      const path = issue.path.length ? `[${issue.path.join('.')}] ` : ''
      console.error(`  ${path}${issue.message}`)
    }
    failed = true
  }
}

if (failed) {
  console.error('\nData validation failed — build aborted.')
  process.exit(1)
}

console.log('\n✓ All data valid.')
