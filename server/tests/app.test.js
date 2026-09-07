import { describe, expect, it } from "vitest"
import request from "supertest"

import app from "../app.js"

describe("Express application", () => {
  it("responds from the root endpoint", async () => {
    const response = await request(app)
      .get("/")

    expect(response.status).toBe(200)
    expect(response.text).toBe("Relocation Budget API")
  })

  it("returns JSON 404 responses for unknown routes", async () => {
    const response = await request(app)
      .get("/api/does-not-exist")

    expect(response.status).toBe(404)
    expect(response.body).toEqual({
      error: "Route not found",
    })
  })
})