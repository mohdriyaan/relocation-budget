import { describe, expect, it, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import ExpenseList from "./ExpenseList.jsx"

vi.mock("./ExpenseItem.jsx", () => ({
  default: ({
    expense,
    onDeleteExpense,
    onEditExpense,
    onDeleteConfirmed,
  }) => (
    <article data-testid={`expense-${expense._id}`}>
      <h3>{expense.name}</h3>

      <button
        type="button"
        onClick={() => onEditExpense(expense)}
      >
        Edit {expense.name}
      </button>

      <button
        type="button"
        onClick={() => onDeleteExpense(expense._id)}
      >
        Delete {expense.name}
      </button>

      <button
        type="button"
        onClick={onDeleteConfirmed}
      >
        Confirm {expense.name}
      </button>
    </article>
  ),
}))

describe("ExpenseList", () => {
  const expenses = [
    {
      _id: "expense-1",
      name: "Flight ticket",
      category: "Flights",
      amount: 1500,
      currency: "NZD",
      frequency: "one-time",
      notes: "",
    },
    {
      _id: "expense-2",
      name: "Accommodation",
      category: "Accommodation",
      amount: 2500,
      currency: "NZD",
      frequency: "monthly",
      notes: "",
    },
  ]

  const defaultProps = {
    expenses,
    onDeleteExpense: vi.fn(),
    isLoading: false,
    error: null,
    deleteError: null,
    onEditExpense: vi.fn(),
    headingRef: { current: null },
    onDeleteConfirmed: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders the planned expenses heading and count", () => {
    render(<ExpenseList {...defaultProps} />)

    expect(
      screen.getByRole("heading", {
        name: "Planned expenses",
      })
    ).toBeInTheDocument()

    expect(
      screen.getByText("Review and manage your relocation costs.")
    ).toBeInTheDocument()

    expect(
      screen.getByText("2 expenses")
    ).toBeInTheDocument()
  })

  it("renders a singular expense count", () => {
    render(
      <ExpenseList
        {...defaultProps}
        expenses={[expenses[0]]}
      />
    )

    expect(
      screen.getByText("1 expense")
    ).toBeInTheDocument()
  })

  it("renders the loading state", () => {
    render(
      <ExpenseList
        {...defaultProps}
        isLoading={true}
      />
    )

    expect(
      screen.getByRole("status", {
        name: "Loading expenses",
      })
    ).toBeInTheDocument()

    expect(
      screen.queryByRole("heading", {
        name: "Planned expenses",
      })
    ).not.toBeInTheDocument()
  })

  it("renders the error state", () => {
    render(
      <ExpenseList
        {...defaultProps}
        error="Unable to load expenses"
      />
    )

    expect(
      screen.getByRole("alert")
    ).toHaveTextContent("Unable to load expenses")

    expect(
      screen.queryByRole("heading", {
        name: "Planned expenses",
      })
    ).not.toBeInTheDocument()
  })

  it("renders the empty state", () => {
    render(
      <ExpenseList
        {...defaultProps}
        expenses={[]}
      />
    )

    expect(
      screen.getByText("No expenses yet")
    ).toBeInTheDocument()

    expect(
      screen.getByText(
        "Add your first relocation expense to start building your budget."
      )
    ).toBeInTheDocument()

    expect(
      screen.getByText("0 expenses")
    ).toBeInTheDocument()
  })

  it("renders each expense through ExpenseItem", () => {
    render(<ExpenseList {...defaultProps} />)

    expect(
      screen.getByTestId("expense-expense-1")
    ).toBeInTheDocument()

    expect(
      screen.getByTestId("expense-expense-2")
    ).toBeInTheDocument()

    expect(
      screen.getByRole("heading", {
        name: "Flight ticket",
      })
    ).toBeInTheDocument()

    expect(
      screen.getByRole("heading", {
        name: "Accommodation",
      })
    ).toBeInTheDocument()
  })

  it("passes edit actions to ExpenseItem", async () => {
    const user = userEvent.setup()
    const onEditExpense = vi.fn()

    render(
      <ExpenseList
        {...defaultProps}
        onEditExpense={onEditExpense}
      />
    )

    await user.click(
      screen.getByRole("button", {
        name: "Edit Flight ticket",
      })
    )

    expect(onEditExpense).toHaveBeenCalledTimes(1)
    expect(onEditExpense).toHaveBeenCalledWith(expenses[0])
  })

  it("passes delete actions to ExpenseItem", async () => {
    const user = userEvent.setup()
    const onDeleteExpense = vi.fn()

    render(
      <ExpenseList
        {...defaultProps}
        onDeleteExpense={onDeleteExpense}
      />
    )

    await user.click(
      screen.getByRole("button", {
        name: "Delete Flight ticket",
      })
    )

    expect(onDeleteExpense).toHaveBeenCalledTimes(1)
    expect(onDeleteExpense).toHaveBeenCalledWith("expense-1")
  })

  it("passes delete confirmation callbacks to ExpenseItem", async () => {
    const user = userEvent.setup()
    const onDeleteConfirmed = vi.fn()

    render(
      <ExpenseList
        {...defaultProps}
        onDeleteConfirmed={onDeleteConfirmed}
      />
    )

    await user.click(
      screen.getByRole("button", {
        name: "Confirm Flight ticket",
      })
    )

    expect(onDeleteConfirmed).toHaveBeenCalledTimes(1)
  })

  it("renders a delete error without hiding the expense list", () => {
    render(
      <ExpenseList
        {...defaultProps}
        deleteError="Unable to delete expense"
      />
    )

    expect(
      screen.getByRole("alert")
    ).toHaveTextContent("Unable to delete expense")

    expect(
      screen.getByTestId("expense-expense-1")
    ).toBeInTheDocument()

    expect(
      screen.getByTestId("expense-expense-2")
    ).toBeInTheDocument()
  })

  it("passes the heading ref to the planned expenses heading", () => {
    const headingRef = { current: null }

    render(
      <ExpenseList
        {...defaultProps}
        headingRef={headingRef}
      />
    )

    expect(
      screen.getByRole("heading", {
        name: "Planned expenses",
      })
    ).toBe(headingRef.current)
  })
})