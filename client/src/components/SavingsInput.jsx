// components/SavingsInput.jsx

const SavingsInput = ({name, onChange, placeholder, value,error}) => {
  return (
    <div className="relative w-full">
      <input 
        name={name} 
        type="number" 
        // min="0.01"
        step="0.01"
        placeholder={placeholder} 
        onChange={onChange} 
        value={value}
        required
        className="w-full bg-slate-950 border border-slate-700 text-white text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block p-3 placeholder-slate-600 transition-colors" 
      />
      <p>{error}</p>
    </div>
  )
}
export default SavingsInput