const requiredEnvironmentVariables = [
  "DB_URL",
  "JWT_SECRET",
  "CLIENT_ORIGIN",
]

const missingEnvironmentVariables =
  requiredEnvironmentVariables.filter(
    (variable) => !process.env[variable]
  )

if (missingEnvironmentVariables.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingEnvironmentVariables.join(
      ", "
    )}`
  )
}

const PORT = Number(process.env.PORT) || 5000

if (!Number.isInteger(PORT) || PORT <= 0) {
  throw new Error("PORT must be a valid positive integer.")
}

const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN
const JWT_SECRET = process.env.JWT_SECRET

const NODE_ENV = process.env.NODE_ENV || "development"
const IS_PRODUCTION = NODE_ENV === "production"

export {
  PORT,
  CLIENT_ORIGIN,
  JWT_SECRET,
  IS_PRODUCTION
}