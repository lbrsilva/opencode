import { expect, test } from "bun:test"
import { App } from "@opencode/core/app"

test("formats app metadata as a user agent", () => {
  expect(App.useragent(App.make({ name: "sdk", version: "1.2.3", channel: "beta" }))).toBe("opencode/beta/1.2.3/sdk")
})

test("formats a branded version as a runtime user agent", () => {
  expect(App.useragent(App.make({ name: "sdk", version: "2.1.3-lbrsilva(1792692136)", channel: "latest" }))).toBe(
    "opencode/latest/2.1.3/sdk",
  )
})
