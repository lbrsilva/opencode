export * as ContextMap from "./context-map.js"

import path from "path"
import type { Entry } from "@opencode/schema/config"
import { Wildcard } from "./wildcard.js"

export type Context = {
  readonly exclude: readonly string[]
  readonly include: readonly string[]
}

export function of(entries: readonly Entry[]): Context {
  const exclude: string[] = []
  const include: string[] = []
  for (const entry of entries) {
    if (entry.type !== "document") continue
    exclude.push(...(entry.info.context?.exclude ?? []))
    include.push(...(entry.info.context?.include ?? []))
  }
  return { exclude, include }
}

function matches(target: string, pattern: string, directory: string): boolean {
  return (
    Wildcard.match(path.basename(target), pattern) ||
    Wildcard.match(path.relative(directory, target), pattern) ||
    Wildcard.match(target, pattern)
  )
}

export function isIgnored(context: Context, directory: string, filepath: string): boolean {
  return context.exclude.some((pattern) => matches(filepath, pattern, directory))
}

export function filterPaths(context: Context, directory: string, paths: Iterable<string>): Set<string> {
  if (context.exclude.length === 0) return new Set(paths)
  const filtered = new Set<string>()
  for (const filepath of paths) {
    if (!context.exclude.some((pattern) => matches(filepath, pattern, directory))) filtered.add(filepath)
  }
  return filtered
}

export function isExternalDirIgnored(context: Context, directory: string): boolean {
  const root = path.dirname(directory)
  const candidates = [directory, root, path.basename(directory), path.basename(root)]
  return context.exclude.some((pattern) =>
    candidates.some((candidate) => Wildcard.match(candidate, pattern) || Wildcard.match(`*/${candidate}`, pattern)),
  )
}
