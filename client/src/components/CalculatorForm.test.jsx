import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import CalculatorForm from "./CalculatorForm.jsx"

describe("CalculatorForm", () => {
  const defaultProps = {
    onCalculate: vi.fn(),
    onDestinationCurrencyChange: vi.fn(),
    exchangeRateError: null,
    calculationError: null,
    isCalculating: false,
    initialBudget: null,
    hasCalculated: false,
  }

  it("renders the calculator form", () => {
    render(<CalculatorForm {...defaultProps} />)

    expect(
      screen.getByRole("heading", {
        name: "Calculate your relocation budget",
      })
    ).toBeInTheDocument()

    expect(
      screen.getByLabelText("Origin currency")
    ).toBeInTheDocument()

    expect(
      screen.getByLabelText("Destination currency")
    ).toBeInTheDocument()

    expect(
      screen.getByLabelText("Total savings")
    ).toBeInTheDocument()

    expect(
      screen.getByRole("button", {
        name: "Calculate budget",
      })
    ).toBeInTheDocument()
  })

  it("shows an error when savings are empty", async () => {
    const user = userEvent.setup()

    render(<CalculatorForm {...defaultProps} />)

    await user.click(
      screen.getByRole("button", {
        name: "Calculate budget",
      })
    )

    expect(
      screen.getByText("Savings should not be empty")
    ).toBeInTheDocument()

    expect(defaultProps.onCalculate).not.toHaveBeenCalled()
  })

  it("shows an error when savings are zero", async () => {
    const user = userEvent.setup()

    render(<CalculatorForm {...defaultProps} />)

    const savingsInput = screen.getByLabelText("Total savings")

    await user.type(savingsInput, "0")

    await user.click(
      screen.getByRole("button", {
        name: "Calculate budget",
      })
    )

    expect(
      screen.getByText("Savings should be greater than 0")
    ).toBeInTheDocument()

    expect(defaultProps.onCalculate).not.toHaveBeenCalled()
  })

  it("submits valid savings", async () => {
    const user = userEvent.setup()
    const onCalculate = vi.fn()

    render(
      <CalculatorForm
        {...defaultProps}
        onCalculate={onCalculate}
      />
    )

    await user.type(
      screen.getByLabelText("Total savings"),
      "1500000"
    )

    await user.click(
      screen.getByRole("button", {
        name: "Calculate budget",
      })
    )

    expect(onCalculate).toHaveBeenCalledTimes(1)

    const submittedData = onCalculate.mock.calls[0][0]

    expect(submittedData).toEqual({
      originCurrency: "INR",
      destinationCurrency: "NZD",
      savings: "1500000",
    })
  })

  it("updates the destination currency", async () => {
    const user = userEvent.setup()
    const onDestinationCurrencyChange = vi.fn()

    render(
      <CalculatorForm
        {...defaultProps}
        onDestinationCurrencyChange={
          onDestinationCurrencyChange
        }
      />
    )

    const destinationCurrency = screen.getByLabelText(
      "Destination currency"
    )

    await user.selectOptions(destinationCurrency, "USD")

    expect(onDestinationCurrencyChange).toHaveBeenCalledWith(
      "USD"
    )
  })

  it("shows the calculating state", () => {
    render(
      <CalculatorForm
        {...defaultProps}
        isCalculating={true}
      />
    )

    expect(
      screen.getByRole("button", {
        name: "Calculating...",
      })
    ).toBeDisabled()
  })
})