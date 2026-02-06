import { useState } from "react";
import { motion } from "framer-motion";
import { VALIDATION } from "../utils/animationConfig";

export const AddPersonForm = ({ onAdd, nextId, darkMode, disabled = false }) => {
  const [weight, setWeight] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const weightNum = parseInt(weight);

    if (!weight || isNaN(weightNum)) {
      setError(VALIDATION.WEIGHT_ERROR_MESSAGES.EMPTY);
      return;
    }

    if (weightNum < VALIDATION.MIN_WEIGHT) {
      setError(VALIDATION.WEIGHT_ERROR_MESSAGES.NEGATIVE);
      return;
    }

    if (weightNum > VALIDATION.MAX_WEIGHT) {
      setError(VALIDATION.WEIGHT_ERROR_MESSAGES.TOO_HIGH);
      return;
    }

    onAdd(weightNum);
    setWeight("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label
          className={`block text-sm font-bold mb-2 ${darkMode ? "text-slate-300" : "text-slate-700"}`}
        >
          Weight (kg)
        </label>
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="Enter weight..."
          disabled={disabled}
          className={`w-full px-4 py-3 rounded-lg font-mono text-lg transition-all
            ${
              darkMode
                ? "bg-slate-800 border-2 border-slate-700 text-white focus:border-cyan-500"
                : "bg-white border-2 border-slate-300 text-slate-900 focus:border-blue-500"
            } ${disabled ? "opacity-50 cursor-not-allowed" : ""} focus:outline-none`}
        />
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-sm font-semibold"
        >
          {error}
        </motion.div>
      )}

      <button
        type="submit"
        disabled={disabled}
        className={`w-full py-3 rounded-lg font-bold text-lg transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
          ${
            darkMode
              ? "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg shadow-cyan-900/50"
              : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg shadow-blue-500/50"
          }`}
      >
        Add Person (ID: {nextId})
      </button>
    </form>
  );
};
