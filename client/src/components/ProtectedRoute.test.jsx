import { beforeEach, describe, expect, it, vi } from "vitest"
import {
  render,
  screen,
} from "@testing-library/react"
import {
  MemoryRouter,
  useLocation,
} from "react-router-dom"

import ProtectedRoute from "./ProtectedRoute.jsx"

const mockUseAuth = vi.fn()

vi.mock("../hooks/useAuth.js", () => ({
  default: () => mockUseAuth(),
}))

const ProtectedContent = () => (
  <div>Protected content</div>
)

const LocationDisplay = () => {
  const location = useLocation()

  return (
    <div data-testid="location">
      {location.pathname}
    </div>
  )
}

describe("ProtectedRoute", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("shows a loading state while authentication is loading", () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: true,
    })

    render(
      <MemoryRouter initialEntries={["/"]}>
        <ProtectedRoute>
          <ProtectedContent />
        </ProtectedRoute>
      </MemoryRouter>
    )

    expect(
      screen.getByText("Loading...")
    ).toBeInTheDocument()

    expect(
      screen.queryByText("Protected content")
    ).not.toBeInTheDocument()
  })

  it("redirects unauthenticated users to the login page", () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
    })

    render(
      <MemoryRouter initialEntries={["/calculator"]}>
        <ProtectedRoute>
          <ProtectedContent />
        </ProtectedRoute>

        <LocationDisplay />
      </MemoryRouter>
    )

    expect(
      screen.queryByText("Protected content")
    ).not.toBeInTheDocument()

    expect(
      screen.getByTestId("location")
    ).toHaveTextContent("/login")
  })

  it("renders protected content for authenticated users", () => {
    mockUseAuth.mockReturnValue({
      user: {
        id: "user-1",
        email: "test@example.com",
      },
      loading: false,
    })

    render(
      <MemoryRouter initialEntries={["/"]}>
        <ProtectedRoute>
          <ProtectedContent />
        </ProtectedRoute>
      </MemoryRouter>
    )

    expect(
      screen.getByText("Protected content")
    ).toBeInTheDocument()
  })

  it("does not render protected content while authentication is loading", () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: true,
    })

    render(
      <MemoryRouter initialEntries={["/calculator"]}>
        <ProtectedRoute>
          <ProtectedContent />
        </ProtectedRoute>
      </MemoryRouter>
    )

    expect(
      screen.getByText("Loading...")
    ).toBeInTheDocument()

    expect(
      screen.queryByText("Protected content")
    ).not.toBeInTheDocument()
  })
})