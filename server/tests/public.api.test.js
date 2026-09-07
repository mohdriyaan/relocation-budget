import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest"
import request from "supertest"

const {
  mockValidateCurrency,
  mockGetExchangeRate,
} = vi.hoisted(() => ({
  mockValidateCurrency: vi.fn(),
  mockGetExchangeRate: vi.fn(),
}))

vi.mock("../utils/validateCurrency.js", () => ({
  default: mockValidateCurrency,
}))

vi.mock("../services/exchangeRateService.js", () => ({
  default: mockGetExchangeRate,
}))

import app from "../app.js"

describe("Public API", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("GET /api/health/", () => {
    it("returns a healthy API response", async () => {
      const response = await request(app)
        .get("/api/health/")

      expect(response.status).toBe(200)

      expect(response.body).toEqual({
        status: "ok",
        message: "Relocation Budget API is running",
      })
    })
  })

  describe("GET /api/currency/:code", () => {
    it("returns a valid currency", async () => {
      mockValidateCurrency.mockReturnValue("INR")

      const response = await request(app)
        .get("/api/currency/INR")

      expect(response.status).toBe(200)

      expect(response.body).toEqual({
        currency: "INR",
      })

      expect(mockValidateCurrency).toHaveBeenCalledWith(
        "INR"
      )
    })

    it("returns 400 for an invalid currency", async () => {
      mockValidateCurrency.mockReturnValue(null)

      const response = await request(app)
        .get("/api/currency/INVALID")

      expect(response.status).toBe(400)

      expect(response.body).toEqual({
        error: "Invalid currency",
      })

      expect(mockValidateCurrency).toHaveBeenCalledWith(
        "INVALID"
      )
    })
  })

  describe("GET /api/exchange-rate/:from/:to", () => {
    it("returns an exchange rate for valid currencies", async () => {
      mockValidateCurrency
        .mockReturnValueOnce("INR")
        .mockReturnValueOnce("NZD")

      mockGetExchangeRate.mockResolvedValue(0.019)

      const response = await request(app)
        .get("/api/exchange-rate/INR/NZD")

      expect(response.status).toBe(200)

      expect(response.body).toEqual({
        from: "INR",
        to: "NZD",
        rate: 0.019,
      })

      expect(mockValidateCurrency)
        .toHaveBeenNthCalledWith(1, "INR")

      expect(mockValidateCurrency)
        .toHaveBeenNthCalledWith(2, "NZD")

      expect(mockGetExchangeRate).toHaveBeenCalledWith(
        "INR",
        "NZD"
      )
    })

    it("returns 400 when the source currency is invalid", async () => {
      mockValidateCurrency
        .mockReturnValueOnce(null)
        .mockReturnValueOnce("NZD")

      const response = await request(app)
        .get("/api/exchange-rate/INVALID/NZD")

      expect(response.status).toBe(400)

      expect(response.body).toEqual({
        error: "One of the currency is invalid",
      })

      expect(mockGetExchangeRate).not.toHaveBeenCalled()
    })

    it("returns 400 when the destination currency is invalid", async () => {
      mockValidateCurrency
        .mockReturnValueOnce("INR")
        .mockReturnValueOnce(null)

      const response = await request(app)
        .get("/api/exchange-rate/INR/INVALID")

      expect(response.status).toBe(400)

      expect(response.body).toEqual({
        error: "One of the currency is invalid",
      })

      expect(mockGetExchangeRate).not.toHaveBeenCalled()
    })

    it("returns 502 when the exchange-rate service fails", async () => {
      mockValidateCurrency
        .mockReturnValueOnce("INR")
        .mockReturnValueOnce("NZD")

      mockGetExchangeRate.mockRejectedValue(
        new Error("Exchange provider unavailable")
      )

      const response = await request(app)
        .get("/api/exchange-rate/INR/NZD")

      expect(response.status).toBe(502)

      expect(response.body).toEqual({
        error: "Exchange provider unavailable",
      })

      expect(mockGetExchangeRate).toHaveBeenCalledWith(
        "INR",
        "NZD"
      )
    })
  })
})