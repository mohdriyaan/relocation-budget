import { beforeAll } from "vitest"

beforeAll(() => {
  process.env.DB_URL = "mongodb://127.0.0.1:27017/relocation-budget-test"
  process.env.JWT_SECRET = "test-jwt-secret"
  process.env.CLIENT_ORIGIN = "http://localhost:5173"
  process.env.NODE_ENV = "test"
})