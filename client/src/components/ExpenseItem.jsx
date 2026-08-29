// components/ExpenseItem.jsx

const ExpenseItem = ({ expense, onDeleteExpense }) => {
  const { _id, category, name, amount, notes, frequency } = expense;

  return (
    <div className="flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors">
      {/* Category, Frequency, Name, and Notes */}
      <div className="flex-1 min-w-0 mr-4">
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            {category || "General"}
          </span>
          <span
            className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${
              frequency === "monthly"
                ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                : "bg-slate-800 text-slate-400 border-slate-700"
            }`}
          >
            {frequency === "monthly" ? "Monthly" : "One-time"}
          </span>
        </div>
        <h3 className="text-base font-semibold text-white truncate">{name}</h3>
        {notes && (
          <p className="text-xs text-slate-400 mt-1 truncate">{notes}</p>
        )}
      </div>

      {/* Amount & Delete Action */}
      <div className="flex items-center gap-4">
        <span className="text-lg font-mono font-bold text-emerald-400">
          ${amount}
        </span>
        <button
          onClick={() => onDeleteExpense(_id)}
          type="button"
          aria-label="Delete expense"
          className="text-slate-400 hover:text-rose-400 p-2 rounded-lg hover:bg-rose-500/10 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500/40"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ExpenseItem;