import Budget from "../models/Budget.js"

const getBudget = async (req, res) => {
  try {
    const budget = await Budget.findOne({ user: req.user })

    if (!budget) {
      return res.status(404).json({
        error: "Budget not found"
      })
    }

    return res.status(200).json({
      budget
    })
  } catch (error) {
    return res.status(500).json({
      error: "Unable to retrieve budget"
    })
  }
}

const createOrUpdateBudget = async (req, res) => {
  try {
    const {
      savings,
      originCurrency,
      destinationCurrency
    } = req.body

    if (
      savings === undefined ||
      !originCurrency ||
      !destinationCurrency
    ) {
      return res.status(400).json({
        error: "Savings and currencies are required"
      })
    }

    const budget = await Budget.findOneAndUpdate(
      { user: req.user },
      {
        savings,
        originCurrency,
        destinationCurrency
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    )

    return res.status(200).json({
      budget
    })
  } catch (error) {
    return res.status(500).json({
      error: "Unable to save budget"
    })
  }
}

export { getBudget, createOrUpdateBudget }