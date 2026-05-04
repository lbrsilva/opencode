import path from "path"
import { minimatch } from "minimatch"
import type { ConfigV1 } from "@opencode-ai/core/v1/config/config"

export namespace ContextMap {
  function matches(filepath: string, pattern: string, directory: string): boolean {
    const basename = path.basename(filepath)
    const relative = path.relative(directory, filepath)
    return minimatch(basename, pattern) || minimatch(relative, pattern) || minimatch(filepath, pattern)
  }

  export function isIgnored(
    config: ConfigV1.Info,
    directory: string,
    filepath: string,
  ): boolean {
    const patterns = config.context?.exclude ?? []
    return patterns.some((pattern: string) => matches(filepath, pattern, directory))
  }

  export function filterPaths(
    config: ConfigV1.Info,
    directory: string,
    paths: Set<string>,
  ): Set<string> {
    const patterns = config.context?.exclude ?? []
    if (patterns.length === 0) return paths
    const filtered = new Set<string>()
    for (const p of paths) {
      if (!patterns.some((pattern: string) => matches(p, pattern, directory))) {
        filtered.add(p)
      }
    }
    return filtered
  }

  export function isExternalDirIgnored(
    config: ConfigV1.Info,
    dirName: string,
  ): boolean {
    const patterns = config.context?.exclude ?? []
    return patterns.some(
      (pattern: string) =>
        minimatch(dirName, pattern) ||
        minimatch(`*/${dirName}`, pattern) ||
        minimatch(`*/${dirName}/*`, pattern),
    )
  }

  export function contextPatterns(config: ConfigV1.Info): readonly string[] {
    return config.context?.include ?? []
  }
}

export default ContextMap
