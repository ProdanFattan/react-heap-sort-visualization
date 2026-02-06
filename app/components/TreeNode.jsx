import { motion } from "framer-motion";

// Helper function to get node className based on state
const getNodeClassName = (isSwapping, isComparing, isHighlighted, darkMode) => {
  const baseClasses = "relative flex flex-col items-center justify-center w-20 h-20 rounded-lg cursor-pointer transition-all duration-300";

  if (isSwapping) {
    return `${baseClasses} ${
      darkMode
        ? "bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 shadow-xl shadow-green-500/50 scale-110 animate-pulse"
        : "bg-gradient-to-br from-green-400 via-emerald-500 to-teal-500 shadow-xl shadow-green-500/50 scale-110 animate-pulse"
    }`;
  }

  if (isComparing) {
    return `${baseClasses} ${
      darkMode
        ? "bg-gradient-to-br from-yellow-500 via-orange-500 to-red-600 shadow-xl shadow-yellow-500/50 scale-105"
        : "bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 shadow-xl shadow-yellow-500/50 scale-105"
    }`;
  }

  if (isHighlighted) {
    return `${baseClasses} ${
      darkMode
        ? "bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 shadow-xl shadow-cyan-500/50 scale-110"
        : "bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-500 shadow-xl shadow-blue-500/50 scale-110"
    }`;
  }

  return `${baseClasses} ${
    darkMode
      ? "bg-slate-800 border-2 border-slate-700 hover:border-cyan-500"
      : "bg-white border-2 border-slate-300 hover:border-blue-500 shadow-md"
  }`;
};

// Helper to get text color based on state
const getTextColor = (darkMode, isActive) => {
  if (isActive) return "text-white";
  return darkMode ? "text-slate-400" : "text-slate-600";
};

const getWeightColor = (darkMode, isActive) => {
  if (isActive) return "text-white";
  return darkMode ? "text-white" : "text-slate-900";
};

const getUnitColor = (darkMode, isActive) => {
  if (isActive) return "text-cyan-100";
  return "text-slate-500";
};

export const TreeNode = ({
  person,
  index,
  highlighted,
  isExtracting,
  isComparing,
  isSwapping,
  darkMode,
  onClick,
}) => {
  const isHighlighted = highlighted.includes(index);
  const isActive = isHighlighted || isComparing || isSwapping;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: isExtracting ? 0.8 : isSwapping ? 1.1 : 1,
        opacity: isExtracting ? 0.5 : 1,
      }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{
        type: isSwapping ? "tween" : "spring",
        stiffness: 300,
        damping: 25,
        duration: isSwapping ? 0.5 : 0.3,
      }}
      onClick={() => onClick?.(person, index)}
      className={getNodeClassName(isSwapping, isComparing, isHighlighted, darkMode)}
    >
      <div className={`text-xs font-bold ${getTextColor(darkMode, isActive)}`}>
        ID: {person.personId}
      </div>
      <div className={`text-lg font-black ${getWeightColor(darkMode, isActive)}`}>
        {person.weight}
      </div>
      <div className={`text-xs ${getUnitColor(darkMode, isActive)}`}>
        kg
      </div>
    </motion.div>
  );
};
