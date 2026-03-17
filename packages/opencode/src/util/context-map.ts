import path from "path"
import { minimatch } from "minimatch"
import { Config } from "../config/config"
import { Instance } from "../project/instance"

export namespace ContextMap {
  async function excludePatterns(): Promise<string[]> {
    const config = await Config.get()
    return config.context?.exclude ?? []
  }

  async function includePatterns(): Promise<string[]> {
    const config = await Config.get()
    return config.context?.include ?? []
  }

  function matches(filepath: string, patterns: string[]): boolean {
    const basename = path.basename(filepath)
    const relative = path.relative(Instance.directory, filepath)

    for (const pattern of patterns) {
      if (minimatch(basename, pattern)) return true
      if (minimatch(relative, pattern)) return true
      if (minimatch(filepath, pattern)) return true
    }
    return false
  }

  export async function isIgnored(filepath: string): Promise<boolean> {
    const patterns = await excludePatterns()
    if (patterns.length === 0) return false
    return matches(filepath, patterns)
  }

  export async function filterPaths(paths: Set<string>): Promise<Set<string>> {
    const patterns = await excludePatterns()
    if (patterns.length === 0) return paths
    const result = new Set<string>()
    for (const p of paths) {
      if (!matches(p, patterns)) {
        result.add(p)
      }
    }
    return result
  }

  export async function isExternalDirIgnored(dirName: string): Promise<boolean> {
    const patterns = await excludePatterns()
    if (patterns.length === 0) return false
    for (const pattern of patterns) {
      if (minimatch(dirName, pattern)) return true
      const segments = pattern.split("/")
      for (const segment of segments) {
        if (segment !== "*" && minimatch(dirName, segment)) return true
      }
    }
    return false
  }

  export async function contextPatterns(): Promise<string[]> {
    return includePatterns()
  }
}
