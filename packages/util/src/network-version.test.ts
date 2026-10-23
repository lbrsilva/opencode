import { describe, expect, test } from "bun:test"
import { networkVersion } from "./network-version.js"

describe("networkVersion", () => {
  test("strips a non-semver suffix", () => {
    expect(networkVersion("2.1.3-lbrsilva(1792692136)")).toBe("2.1.3")
  })

  test("normalizes the v prefix", () => {
    expect(networkVersion("v2.1.3")).toBe("2.1.3")
  })

  test("preserves semver prerelease suffixes", () => {
    expect(networkVersion("2.1.3-beta.1")).toBe("2.1.3-beta.1")
    expect(networkVersion("0.0.0-dev")).toBe("0.0.0-dev")
  })

  test("keeps a plain core version", () => {
    expect(networkVersion("2.1.3")).toBe("2.1.3")
  })

  test("does not truncate versions with extra numeric segments", () => {
    expect(networkVersion("2.1.3.4")).toBe("2.1.3.4")
  })

  test("returns unrecognized versions unchanged", () => {
    expect(networkVersion("local")).toBe("local")
    expect(networkVersion("unknown")).toBe("unknown")
  })
})
