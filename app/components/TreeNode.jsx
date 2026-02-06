import { motion } from "framer-motion";

// Helper function to get node className based on state
const getNodeClassName = (isSwapping, isComparing, isHighlighted, darkMode) => {
  const baseClasses = "relative flex flex-col items-center justify-center w-20 h-20 rounded-xl cursor-pointer transition-all duration-500";

  if (isSwapping) {
    return `${baseClasses} ${
      darkMode
        ? "bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 shadow-2xl shadow-green-500/70 ring-4 ring-green-400/50 animate-pulse"
        : "bg-gradient-to-br from-green-300 via-emerald-400 to-teal-500 shadow-2xl shadow-green-500/70 ring-4 ring-green-300/50 animate-pulse"
    }`;
  }

  if (isComparing) {
    return `${baseClasses} ${
      darkMode
        ? "bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600 shadow-2xl shadow-orange-500/70 ring-4 ring-yellow-400/50"
        : "bg-gradient-to-br from-yellow-300 via-orange-400 to-red-500 shadow-2xl shadow-orange-500/70 ring-4 ring-yellow-300/50"
    }`;
  }

  if (isHighlighted) {
    return `${baseClasses} ${
      darkMode
        ? "bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 shadow-2xl shadow-cyan-500/70 ring-4 ring-cyan-400/50"
        : "bg-gradient-to-br from-cyan-300 via-blue-400 to-purple-500 shadow-2xl shadow-blue-500/70 ring-4 ring-cyan-300/50"
    }`;
  }

  return `${baseClasses} ${
    darkMode
      ? "bg-slate-800 border-2 border-slate-700 hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-500/30"
      : "bg-white border-2 border-slate-300 hover:border-blue-500 shadow-lg hover:shadow-xl hover:shadow-blue-500/30"
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
      initial={{ scale: 0, opacity: 0, rotateZ: -180 }}
      animate={{
        scale: isExtracting ? 0.8 : isSwapping ? 1.15 : isComparing ? 1.08 : isHighlighted ? 1.1 : 1,
        opacity: isExtracting ? 0.5 : 1,
        rotateZ: isSwapping ? [0, -5, 5, -5, 0] : 0,
        rotateY: isComparing ? [0, 10, -10, 0] : 0,
      }}
      exit={{ scale: 0, opacity: 0, rotateZ: 180 }}
      transition={{
        type: "spring",
        stiffness: isSwapping ? 400 : 350,
        damping: isSwapping ? 18 : 22,
        duration: 0.6,
        rotateZ: {
          duration: 0.6,
          ease: "easeInOut",
        },
        rotateY: {
          duration: 0.5,
          ease: "easeInOut",
        },
      }}
      whileHover={{
        scale: 1.05,
        rotateZ: 2,
        transition: { duration: 0.2 },
      }}
      onClick={() => onClick?.(person, index)}
      className={getNodeClassName(isSwapping, isComparing, isHighlighted, darkMode)}
    >
      <div className={`text-xs font-bold ${getTextColor(darkMode, isActive)}`}>
        ID: {person.personId}
      </div>
      <motion.div
        className={`text-lg font-black ${getWeightColor(darkMode, isActive)}`}
        animate={{
          scale: isSwapping || isComparing ? [1, 1.2, 1] : 1,
        }}
        transition={{
          duration: 0.4,
          ease: "easeInOut",
        }}
      >
        {person.weight}
      </motion.div>
      <div className={`text-xs ${getUnitColor(darkMode, isActive)}`}>
        kg
      </div>
    </motion.div>
  );
};
