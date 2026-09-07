import { describe, expect, it, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import ExpenseForm from "./ExpenseForm.jsx"

import {
  createExpense,
  updateExpense,
} from "../services/expenseApi.js"

vi.mock("../services/expenseApi.js", () => ({
  createExpense: vi.fn(),
  updateExpense: vi.fn(),
}))

describe("ExpenseForm", () => {
  const defaultProps = {
    addExpense: vi.fn(),
    destinationCurrency: "NZD",
    editingExpense: null,
    onUpdateExpense: vi.fn(),
    onEditComplete: vi.fn(),
    onCancelEdit: vi.fn(),
  }

  const fillValidForm = async (user) => {
    await user.type(
      screen.getByLabelText("Expense name"),
      "Flight ticket"
    )

    await user.clear(screen.getByLabelText("Amount"))
    await user.type(
      screen.getByLabelText("Amount"),
      "1500"
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()

    createExpense.mockResolvedValue({
      expense: {
        _id: "expense-1",
        name: "Flight ticket",
        category: "Flights",
        amount: 1500,
        currency: "NZD",
        frequency: "one-time",
        notes: "",
      },
    })

    updateExpense.mockResolvedValue({
      expense: {
        _id: "expense-1",
        name: "Updated flight",
        category: "Flights",
        amount: 1800,
        currency: "NZD",
        frequency: "one-time",
        notes: "",
      },
    })
  })

  it("renders the expense form", () => {
    render(<ExpenseForm {...defaultProps} />)

    expect(
      screen.getByLabelText("Expense name")
    ).toBeInTheDocument()

    expect(
      screen.getByLabelText("Category")
    ).toBeInTheDocument()

    expect(
      screen.getByLabelText("Currency")
    ).toBeInTheDocument()

    expect(
      screen.getByLabelText("Amount")
    ).toBeInTheDocument()

    expect(
      screen.getByLabelText("Frequency")
    ).toBeInTheDocument()

    expect(
      screen.getByLabelText(/Notes/)
    ).toBeInTheDocument()

    expect(
      screen.getByRole("button", {
        name: "Add expense",
      })
    ).toBeInTheDocument()
  })

  it("shows validation errors when required fields are missing", async () => {
    const user = userEvent.setup()

    render(<ExpenseForm {...defaultProps} />)

    await user.click(
      screen.getByRole("button", {
        name: "Add expense",
      })
    )

    expect(
      screen.getByText("Name is required")
    ).toBeInTheDocument()

    expect(
      screen.getByText("Amount is required")
    ).toBeInTheDocument()

    expect(createExpense).not.toHaveBeenCalled()
  })

  it("rejects zero amount", async () => {
    const user = userEvent.setup()

    render(<ExpenseForm {...defaultProps} />)

    await user.type(
      screen.getByLabelText("Expense name"),
      "Flight ticket"
    )

    await user.type(
      screen.getByLabelText("Amount"),
      "0"
    )

    await user.click(
      screen.getByRole("button", {
        name: "Add expense",
      })
    )

    expect(
      screen.getByText("Amount must be greater than 0")
    ).toBeInTheDocument()

    expect(createExpense).not.toHaveBeenCalled()
  })

  it("submits a valid expense", async () => {
    const user = userEvent.setup()
    const addExpense = vi.fn()

    render(
      <ExpenseForm
        {...defaultProps}
        addExpense={addExpense}
      />
    )

    await fillValidForm(user)

    await user.click(
      screen.getByRole("button", {
        name: "Add expense",
      })
    )

    expect(createExpense).toHaveBeenCalledTimes(1)

    expect(createExpense).toHaveBeenCalledWith({
      name: "Flight ticket",
      category: "Other",
      amount: 1500,
      currency: "NZD",
      frequency: "one-time",
      notes: "",
    })

    expect(addExpense).toHaveBeenCalledWith(
      expect.objectContaining({
        _id: "expense-1",
        name: "Flight ticket",
      })
    )
  })

  it("uses the destination currency as the default currency", () => {
    render(
      <ExpenseForm
        {...defaultProps}
        destinationCurrency="USD"
      />
    )

    expect(
      screen.getByLabelText("Currency")
    ).toHaveValue("USD")
  })

  it("shows a server error when creating an expense fails", async () => {
    const user = userEvent.setup()

    createExpense.mockRejectedValue(
      new Error("Unable to save expense")
    )

    render(<ExpenseForm {...defaultProps} />)

    await fillValidForm(user)

    await user.click(
      screen.getByRole("button", {
        name: "Add expense",
      })
    )

    expect(
      screen.getByRole("alert")
    ).toHaveTextContent("Unable to save expense")
  })

  it("dismisses the server error", async () => {
    const user = userEvent.setup()

    createExpense.mockRejectedValue(
      new Error("Unable to save expense")
    )

    render(<ExpenseForm {...defaultProps} />)

    await fillValidForm(user)

    await user.click(
      screen.getByRole("button", {
        name: "Add expense",
      })
    )

    expect(
      screen.getByRole("alert")
    ).toBeInTheDocument()

    await user.click(
      screen.getByRole("button", {
        name: "Dismiss error",
      })
    )

    expect(
      screen.queryByRole("alert")
    ).not.toBeInTheDocument()
  })

  it("renders edit mode with existing expense values", () => {
    const editingExpense = {
      _id: "expense-1",
      name: "Flight ticket",
      category: "Flights",
      amount: 1500,
      currency: "NZD",
      frequency: "monthly",
      notes: "Book early",
    }

    render(
      <ExpenseForm
        {...defaultProps}
        editingExpense={editingExpense}
      />
    )

    expect(
      screen.getByText("Editing")
    ).toBeInTheDocument()

    expect(
      screen.getByText("Flight ticket")
    ).toBeInTheDocument()

    expect(
      screen.getByLabelText("Expense name")
    ).toHaveValue("Flight ticket")

    expect(
      screen.getByLabelText("Category")
    ).toHaveValue("Flights")

    expect(
      screen.getByLabelText("Amount")
    ).toHaveValue(1500)

    expect(
      screen.getByLabelText("Currency")
    ).toHaveValue("NZD")

    expect(
      screen.getByLabelText("Frequency")
    ).toHaveValue("monthly")

    expect(
      screen.getByLabelText(/Notes/)
    ).toHaveValue("Book early")

    expect(
      screen.getByRole("button", {
        name: "Update expense",
      })
    ).toBeInTheDocument()
  })

  it("updates an existing expense", async () => {
    const user = userEvent.setup()
    const onUpdateExpense = vi.fn()
    const onEditComplete = vi.fn()

    const editingExpense = {
      _id: "expense-1",
      name: "Flight ticket",
      category: "Flights",
      amount: 1500,
      currency: "NZD",
      frequency: "one-time",
      notes: "",
    }

    render(
      <ExpenseForm
        {...defaultProps}
        editingExpense={editingExpense}
        onUpdateExpense={onUpdateExpense}
        onEditComplete={onEditComplete}
      />
    )

    const nameInput = screen.getByLabelText("Expense name")
    const amountInput = screen.getByLabelText("Amount")

    await user.clear(nameInput)
    await user.type(nameInput, "Updated flight")

    await user.clear(amountInput)
    await user.type(amountInput, "1800")

    await user.click(
      screen.getByRole("button", {
        name: "Update expense",
      })
    )

    expect(updateExpense).toHaveBeenCalledTimes(1)

    expect(updateExpense).toHaveBeenCalledWith(
      "expense-1",
      {
        name: "Updated flight",
        category: "Flights",
        amount: 1800,
        currency: "NZD",
        frequency: "one-time",
        notes: "",
      }
    )

    expect(onUpdateExpense).toHaveBeenCalledWith(
      expect.objectContaining({
        _id: "expense-1",
        name: "Updated flight",
      })
    )

    expect(onEditComplete).toHaveBeenCalledTimes(1)
  })

  it("cancels edit mode and notifies the parent", async () => {
    const user = userEvent.setup()
    const onCancelEdit = vi.fn()

    const editingExpense = {
      _id: "expense-1",
      name: "Flight ticket",
      category: "Flights",
      amount: 1500,
      currency: "NZD",
      frequency: "one-time",
      notes: "",
    }

    render(
      <ExpenseForm
        {...defaultProps}
        editingExpense={editingExpense}
        onCancelEdit={onCancelEdit}
      />
    )

    const cancelButtons = screen.getAllByRole("button", {
      name: "Cancel",
    })

    await user.click(cancelButtons[1])

    expect(onCancelEdit).toHaveBeenCalledTimes(1)

    expect(
      screen.getByLabelText("Expense name")
    ).toHaveValue("")
  })

  it("shows the saving state while submitting", async () => {
    const user = userEvent.setup()

    let resolveCreateExpense

    createExpense.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveCreateExpense = resolve
        })
    )

    render(<ExpenseForm {...defaultProps} />)

    await fillValidForm(user)

    await user.click(
      screen.getByRole("button", {
        name: "Add expense",
      })
    )

    expect(
      screen.getByRole("button", {
        name: "Saving...",
      })
    ).toBeDisabled()

    resolveCreateExpense({
      expense: {
        _id: "expense-1",
        name: "Flight ticket",
        category: "Other",
        amount: 1500,
        currency: "NZD",
        frequency: "one-time",
        notes: "",
      },
    })
  })
})