export function networkVersion(version: string) {
  const match = /^v?(\d+\.\d+\.\d+)(.*)$/.exec(version)
  if (!match) return version
  const [, core, rest] = match
  const normalized = version.replace(/^v/, "")
  if (!rest) return core
  if (/^(-[0-9A-Za-z.-]+)?(\+[0-9A-Za-z.-]+)?$/.test(rest)) return normalized
  if (!/^[-+]/.test(rest)) return normalized
  return core
}
