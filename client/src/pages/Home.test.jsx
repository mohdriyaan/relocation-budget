import { MemoryRouter } from "react-router-dom"
import { describe, expect, it, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"

import Home from "./Home.jsx"

import useAuth from "../hooks/useAuth.js"
import useDashboardData from "../hooks/useDashboardData.js"

const renderHome = () =>
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  )

vi.mock("../hooks/useAuth.js", () => ({
  default: vi.fn(),
}))

vi.mock("../hooks/useDashboardData.js", () => ({
  default: vi.fn(),
}))

describe("Home", () => {
  const defaultDashboardData = {
    expenses: [],
    budget: null,
    convertedSavings: null,
    convertedExpenses: null,
    remainingBudget: null,
    loading: false,
    error: null,
    fetchDashboardData: vi.fn(),
    convertedExpenseDetails: [],
  }

  beforeEach(() => {
    vi.clearAllMocks()

    useAuth.mockReturnValue({
      user: {
        name: "Riyaan",
      },
    })

    useDashboardData.mockReturnValue(defaultDashboardData)
  })

  it("renders the dashboard heading and user name", () => {
    renderHome(<Home />)

    expect(
      screen.getByRole("heading", {
        name: "Welcome back, Riyaan.",
      })
    ).toBeInTheDocument()

    expect(
      screen.getByRole("heading", {
        name: "Budget overview",
      })
    ).toBeInTheDocument()

    expect(
      screen.getByRole("link", {
        name: "Open Calculator",
      })
    ).toHaveAttribute("href", "/calculator")
  })

  it("renders the loading state", () => {
    useDashboardData.mockReturnValue({
      ...defaultDashboardData,
      loading: true,
    })

    renderHome(<Home />)

    expect(
      screen.getByRole("status", {
        name: "Loading dashboard",
      })
    ).toBeInTheDocument()

    expect(
      screen.queryByText("Set up your relocation budget")
    ).not.toBeInTheDocument()
  })

  it("renders the setup state when no budget exists", () => {
    renderHome(<Home />)

    expect(
      screen.getByText("Getting started")
    ).toBeInTheDocument()

    expect(
      screen.getByRole("heading", {
        name: "Set up your relocation budget",
      })
    ).toBeInTheDocument()

    expect(
      screen.getByRole("link", {
        name: "Set up budget",
      })
    ).toHaveAttribute("href", "/calculator")
  })

  it("renders an error state with a retry action", () => {
    const fetchDashboardData = vi.fn()

    useDashboardData.mockReturnValue({
      ...defaultDashboardData,
      error: "Unable to load dashboard data",
      fetchDashboardData,
    })

    renderHome(<Home />)

    expect(
      screen.getByRole("alert")
    ).toHaveTextContent("Unable to load dashboard")

    expect(
      screen.getByRole("alert")
    ).toHaveTextContent("Unable to load dashboard data")

    expect(
      screen.getByRole("button", {
        name: "Try again",
      })
    ).toBeInTheDocument()
  })

  it("renders the active budget summary", () => {
    useDashboardData.mockReturnValue({
      ...defaultDashboardData,
      budget: {
        originCurrency: "INR",
        destinationCurrency: "NZD",
        savings: 1500000,
      },
      convertedSavings: 30000,
      convertedExpenses: 12000,
      remainingBudget: 18000,
      convertedExpenseDetails: [],
    })

    renderHome(<Home />)

    expect(
      screen.getByText("Available")
    ).toBeInTheDocument()

    expect(
      screen.getByText("Planned")
    ).toBeInTheDocument()

    expect(
      screen.getByText("Remaining")
    ).toBeInTheDocument()

    expect(
      screen.getByText("Budget allocation")
    ).toBeInTheDocument()

    expect(
      screen.getByText("Planning insight")
    ).toBeInTheDocument()
  })

  it("renders and sorts the largest expenses first", () => {
    useDashboardData.mockReturnValue({
      ...defaultDashboardData,
      budget: {
        originCurrency: "INR",
        destinationCurrency: "NZD",
        savings: 1500000,
      },
      convertedSavings: 30000,
      convertedExpenses: 12000,
      remainingBudget: 18000,
      expenses: [
        {
          _id: "1",
          name: "Small expense",
          amount: 100,
          currency: "NZD",
          category: "Other",
          frequency: "one-time",
        },
        {
          _id: "2",
          name: "Largest expense",
          amount: 5000,
          currency: "NZD",
          category: "Housing",
          frequency: "monthly",
        },
        {
          _id: "3",
          name: "Medium expense",
          amount: 1000,
          currency: "NZD",
          category: "Travel",
          frequency: "one-time",
        },
      ],
      convertedExpenseDetails: [
        {
          _id: "1",
          name: "Small expense",
          amount: 100,
          currency: "NZD",
          category: "Other",
          frequency: "one-time",
        },
        {
          _id: "2",
          name: "Largest expense",
          amount: 5000,
          currency: "NZD",
          category: "Housing",
          frequency: "monthly",
        },
        {
          _id: "3",
          name: "Medium expense",
          amount: 1000,
          currency: "NZD",
          category: "Travel",
          frequency: "one-time",
        },
      ],
    })

    renderHome(<Home />)

    expect(
      screen.getByRole("heading", {
        name: "Expenses",
      })
    ).toBeInTheDocument()

    const expenseNames = screen
      .getAllByText(
        /Largest expense|Medium expense|Small expense/
      )
      .map((element) => element.textContent)

    expect(expenseNames).toEqual([
      "Largest expense",
      "Medium expense",
      "Small expense",
    ])
  })

  it("shows the empty expense state", () => {
    useDashboardData.mockReturnValue({
      ...defaultDashboardData,
      budget: {
        originCurrency: "INR",
        destinationCurrency: "NZD",
        savings: 1500000,
      },
      convertedSavings: 30000,
      convertedExpenses: 0,
      remainingBudget: 30000,
      convertedExpenseDetails: [],
    })

    renderHome(<Home />)

    expect(
      screen.getByText("No expenses have been added yet.")
    ).toBeInTheDocument()

    expect(
      screen.getByRole("link", {
        name: "Add an expense",
      })
    ).toHaveAttribute("href", "/calculator")
  })
})