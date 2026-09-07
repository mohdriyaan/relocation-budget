import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import ExpenseItem from "./ExpenseItem.jsx"

beforeEach(() => {
  vi.clearAllMocks()

  vi.stubGlobal(
    "requestAnimationFrame",
    (callback) => setTimeout(callback, 0)
  )
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe("ExpenseItem", () => {
  const expense = {
    _id: "expense-1",
    name: "Flight ticket",
    category: "Flights",
    amount: 1500,
    currency: "NZD",
    frequency: "one-time",
    notes: "Book early",
  }

  const defaultProps = {
    expense,
    onDeleteExpense: vi.fn(),
    onEditExpense: vi.fn(),
    onDeleteConfirmed: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()

    vi.stubGlobal("requestAnimationFrame", (callback) => {
      return setTimeout(callback, 0)
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("renders expense details", () => {
    render(<ExpenseItem {...defaultProps} />)

    expect(
      screen.getByRole("heading", {
        name: "Flight ticket",
      })
    ).toBeInTheDocument()

    expect(
      screen.getByText("Flights")
    ).toBeInTheDocument()

    expect(
      screen.getByText("One-time")
    ).toBeInTheDocument()

    expect(
      screen.getByText("NZD")
    ).toBeInTheDocument()

    expect(
      screen.getByText("1,500.00")
    ).toBeInTheDocument()

    expect(
      screen.getByText("Book early")
    ).toBeInTheDocument()
  })

  it("uses General when category is missing", () => {
    render(
      <ExpenseItem
        {...defaultProps}
        expense={{
          ...expense,
          category: "",
        }}
      />
    )

    expect(
      screen.getByText("General")
    ).toBeInTheDocument()
  })

  it("calls the edit callback with the expense", async () => {
    const user = userEvent.setup()
    const onEditExpense = vi.fn()

    render(
      <ExpenseItem
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
    expect(onEditExpense).toHaveBeenCalledWith(expense)
  })

  it("opens delete confirmation", async () => {
    const user = userEvent.setup()

    render(<ExpenseItem {...defaultProps} />)

    await user.click(
      screen.getByRole("button", {
        name: "Delete Flight ticket",
      })
    )

    expect(
      screen.getByText("Delete this expense?")
    ).toBeInTheDocument()

    expect(
      screen.getByText("Flight ticket")
    ).toBeInTheDocument()

    expect(
      screen.getByRole("button", {
        name: "Delete",
      })
    ).toBeInTheDocument()

    expect(
      screen.getByRole("button", {
        name: "Cancel",
      })
    ).toBeInTheDocument()
  })

  it("moves focus to Cancel when delete confirmation opens", async () => {
    const user = userEvent.setup()

    render(<ExpenseItem {...defaultProps} />)

    await user.click(
      screen.getByRole("button", {
        name: "Delete Flight ticket",
      })
    )

    expect(
      screen.getByRole("button", {
        name: "Cancel",
      })
    ).toHaveFocus()
  })

  it("cancels delete confirmation and restores focus to delete button", async () => {
    const user = userEvent.setup()

    render(<ExpenseItem {...defaultProps} />)

    await user.click(
      screen.getByRole("button", {
        name: "Delete Flight ticket",
      })
    )

    await user.click(
      screen.getByRole("button", {
        name: "Cancel",
      })
    )

    expect(
      screen.queryByText("Delete this expense?")
    ).not.toBeInTheDocument()

    await waitFor(() => {
      expect(
        screen.getByRole("button", {
          name: "Delete Flight ticket",
        })
      ).toHaveFocus()
    })
  })

  it("deletes the expense after confirmation", async () => {
    const user = userEvent.setup()
    const onDeleteExpense = vi
      .fn()
      .mockResolvedValue(undefined)
    const onDeleteConfirmed = vi.fn()

    render(
      <ExpenseItem
        {...defaultProps}
        onDeleteExpense={onDeleteExpense}
        onDeleteConfirmed={onDeleteConfirmed}
      />
    )

    await user.click(
      screen.getByRole("button", {
        name: "Delete Flight ticket",
      })
    )

    await user.click(
      screen.getByRole("button", {
        name: "Delete",
      })
    )

    expect(onDeleteExpense).toHaveBeenCalledTimes(1)
    expect(onDeleteExpense).toHaveBeenCalledWith("expense-1")
    expect(onDeleteConfirmed).toHaveBeenCalledTimes(1)

    expect(
      screen.queryByText("Delete this expense?")
    ).not.toBeInTheDocument()
  })

  it("does not call the confirmed callback when deletion fails", async () => {
    const user = userEvent.setup()
    const onDeleteExpense = vi
      .fn()
      .mockRejectedValue(new Error("Delete failed"))
    const onDeleteConfirmed = vi.fn()

    render(
      <ExpenseItem
        {...defaultProps}
        onDeleteExpense={onDeleteExpense}
        onDeleteConfirmed={onDeleteConfirmed}
      />
    )

    await user.click(
      screen.getByRole("button", {
        name: "Delete Flight ticket",
      })
    )

    await user.click(
      screen.getByRole("button", {
        name: "Delete",
      })
    )

    expect(onDeleteExpense).toHaveBeenCalledTimes(1)
    expect(onDeleteExpense).toHaveBeenCalledWith("expense-1")
    expect(onDeleteConfirmed).not.toHaveBeenCalled()

    expect(
      screen.queryByText("Delete this expense?")
    ).not.toBeInTheDocument()
  })

  it("restores focus to the delete button when deletion fails", async () => {
    const user = userEvent.setup()

    const onDeleteExpense = vi
      .fn()
      .mockRejectedValue(new Error("Delete failed"))

    render(
      <ExpenseItem
        expense={expense}
        onDeleteExpense={onDeleteExpense}
        onEditExpense={vi.fn()}
      />
    )

    await user.click(
      screen.getByRole("button", {
        name: "Delete Flight ticket",
      })
    )

    await user.click(
      screen.getByRole("button", {
        name: "Delete",
        exact: true,
      })
    )

    await waitFor(() => {
      expect(onDeleteExpense).toHaveBeenCalledWith(
        expense._id
      )
    })

    await waitFor(() => {
      expect(
        screen.getByRole("button", {
          name: "Delete Flight ticket",
        })
      ).toHaveFocus()
    })
  })
})