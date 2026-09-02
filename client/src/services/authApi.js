import API_BASE_URL from "../config/env.js"

async function login(userDetails) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(userDetails),
    credentials: "include"
  })

  const result = await res.json()

  if (!res.ok) {
    throw new Error(result.error || "Unable to login user")
  }

  return result

}

async function logout() {
  const res = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: "POST",
    credentials: "include"
  })

  const result = await res.json()

  if (!res.ok) {
    throw new Error(result.error || "Unable to logout")
  }

  return result
}

async function getCurrentUser() {
  const res = await fetch(`${API_BASE_URL}/auth/me`, {
    method: "GET",
    credentials: "include"
  })

  const result = await res.json()

  if (!res.ok) {
    throw new Error(result.error || "Unable to get current user")
  }

  return result
}

export { login, logout, getCurrentUser }