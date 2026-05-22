import type { Model, Tool } from '../types'

export const isTool = (entry: Model | Tool): entry is Tool => 'purpose' in entry
