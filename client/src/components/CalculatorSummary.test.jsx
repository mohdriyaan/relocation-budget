import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import CalculatorSummary from "./CalculatorSummary.jsx"

describe("CalculatorSummary", () => {
  const defaultProps = {
    originCurrency: "INR",
    destinationCurrency: "NZD",
    result: 2000,
    remainingBudget: 1250,
    totalExpenses: 750,
    oneTimeExpenses: 500,
    monthlyExpenses: 250,
    runway: 5,
    rate: 0.02,
  }

  it("renders the financial summary", () => {
    render(<CalculatorSummary {...defaultProps} />)

    expect(
      screen.getByRole("heading", { name: "Budget result" })
    ).toBeInTheDocument()

    expect(screen.getByText("Available")).toBeInTheDocument()
    expect(screen.getByText("Planned")).toBeInTheDocument()
    expect(screen.getByText("Remaining")).toBeInTheDocument()
  })

  it("renders a healthy budget status", () => {
    render(<CalculatorSummary {...defaultProps} />)

    expect(screen.getByText("Healthy")).toBeInTheDocument()
  })

  it("renders an over-budget state", () => {
    render(
      <CalculatorSummary
        {...defaultProps}
        totalExpenses={2500}
        remainingBudget={-500}
      />
    )

    expect(screen.getByText("Over budget")).toBeInTheDocument()

    expect(
      screen.getByRole("alert")
    ).toHaveTextContent(
      "Your estimated expenses exceed your current savings."
    )
  })

  it("renders the runway insight", () => {
    render(<CalculatorSummary {...defaultProps} />)

    expect(screen.getByText("5.0 months")).toBeInTheDocument()
    expect(
      screen.getByText("Based on monthly burn rate")
    ).toBeInTheDocument()
  })
})