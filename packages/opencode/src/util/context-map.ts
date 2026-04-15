import path from "path"
import { minimatch } from "minimatch"
import { Instance } from "../project/instance"

export namespace ContextMap {
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

  export function isIgnored(filepath: string, excludePatterns: string[]): boolean {
    if (excludePatterns.length === 0) return false
    return matches(filepath, excludePatterns)
  }

  export function filterPaths(paths: Set<string>, excludePatterns: string[]): Set<string> {
    if (excludePatterns.length === 0) return paths
    const result = new Set<string>()
    for (const p of paths) {
      if (!matches(p, excludePatterns)) {
        result.add(p)
      }
    }
    return result
  }

  export function isExternalDirIgnored(dirName: string, excludePatterns: string[]): boolean {
    if (excludePatterns.length === 0) return false
    for (const pattern of excludePatterns) {
      if (minimatch(dirName, pattern)) return true
      const segments = pattern.split("/")
      for (const segment of segments) {
        if (segment !== "*" && minimatch(dirName, segment)) return true
      }
    }
    return false
  }
}
