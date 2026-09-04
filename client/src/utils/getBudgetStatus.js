function getBudgetStatus(remainingBudget) {
  const numericRemaining = Number(remainingBudget)

  if (!Number.isFinite(numericRemaining)) {
    return {
      key: "unknown",
      label: "Unavailable",
    }
  }

  if (numericRemaining < 0) {
    return {
      key: "over-budget",
      label: "Over budget",
    }
  }

  return {
    key: "healthy",
    label: "Healthy",
  }
}

export default getBudgetStatus