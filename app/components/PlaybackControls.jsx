import { motion } from "framer-motion";

export const PlaybackControls = ({
  isSorting,
  isPaused,
  currentStep,
  totalSteps,
  animationSpeed,
  onPlayPause,
  onStepForward,
  onStepBackward,
  onSpeedChange,
  darkMode,
}) => {
  if (!isSorting) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-xl ${darkMode ? "bg-slate-800" : "bg-white shadow-xl"}`}
    >
      <h2
        className={`text-xl font-black mb-4 ${darkMode ? "text-white" : "text-slate-900"}`}
      >
        Playback Controls
      </h2>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span
            className={`text-sm font-bold ${darkMode ? "text-slate-400" : "text-slate-600"}`}
          >
            Step {currentStep + 1} of {totalSteps}
          </span>
          <span
            className={`text-xs font-mono ${darkMode ? "text-slate-500" : "text-slate-500"}`}
          >
            {Math.round((currentStep / totalSteps) * 100)}%
          </span>
        </div>
        <div
          className={`w-full h-2 rounded-full ${darkMode ? "bg-slate-700" : "bg-slate-200"}`}
        >
          <div
            className={`h-full rounded-full transition-all ${
              darkMode ? "bg-cyan-400" : "bg-blue-500"
            }`}
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={onStepBackward}
          disabled={currentStep <= 0}
          className={`flex-1 py-3 rounded-lg font-bold transition-all transform hover:scale-105 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none
            ${
              darkMode
                ? "bg-slate-700 hover:bg-slate-600 text-white"
                : "bg-slate-200 hover:bg-slate-300 text-slate-900 shadow-md"
            }`}
        >
          ⏮ Back
        </button>

        <button
          onClick={onPlayPause}
          className={`flex-1 py-3 rounded-lg font-bold transition-all transform hover:scale-105 active:scale-95
            ${
              darkMode
                ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-900/50"
                : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg shadow-purple-500/50"
            }`}
        >
          {isPaused ? "▶ Play" : "⏸ Pause"}
        </button>

        <button
          onClick={onStepForward}
          disabled={currentStep >= totalSteps - 1}
          className={`flex-1 py-3 rounded-lg font-bold transition-all transform hover:scale-105 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none
            ${
              darkMode
                ? "bg-slate-700 hover:bg-slate-600 text-white"
                : "bg-slate-200 hover:bg-slate-300 text-slate-900 shadow-md"
            }`}
        >
          Next ⏭
        </button>
      </div>

      {/* Speed Control */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label
            className={`text-sm font-bold ${darkMode ? "text-slate-300" : "text-slate-700"}`}
          >
            Speed
          </label>
          <span
            className={`text-sm font-mono ${darkMode ? "text-cyan-400" : "text-blue-600"}`}
          >
            {animationSpeed}x
          </span>
        </div>
        <input
          type="range"
          min="0.25"
          max="3"
          step="0.25"
          value={animationSpeed}
          onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer"
          style={{
            background: darkMode
              ? `linear-gradient(to right, #22d3ee 0%, #22d3ee ${((animationSpeed - 0.25) / 2.75) * 100}%, #334155 ${((animationSpeed - 0.25) / 2.75) * 100}%, #334155 100%)`
              : `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((animationSpeed - 0.25) / 2.75) * 100}%, #e2e8f0 ${((animationSpeed - 0.25) / 2.75) * 100}%, #e2e8f0 100%)`,
          }}
        />
        <div
          className={`flex justify-between text-xs mt-1 ${darkMode ? "text-slate-500" : "text-slate-400"}`}
        >
          <span>0.25x</span>
          <span>3x</span>
        </div>
      </div>
    </motion.div>
  );
};
