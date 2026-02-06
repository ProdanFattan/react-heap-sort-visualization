import { motion } from 'framer-motion';

export const SortedList = ({ sortedData, darkMode }) => {
  if (!sortedData || sortedData.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-xl ${darkMode ? 'bg-slate-800' : 'bg-white shadow-xl'}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>
          Sorted Result (Descending Order)
        </h3>
        <div className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
          <span className={`text-sm font-bold ${darkMode ? 'text-cyan-400' : 'text-blue-600'}`}>
            {sortedData.length} people
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {sortedData.map((person, index) => (
          <motion.div
            key={`sorted-${person.personId}-${index}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className={`p-3 rounded-lg text-center ${
              darkMode 
                ? 'bg-slate-700 border border-slate-600' 
                : 'bg-slate-50 border border-slate-200'
            }`}
          >
            <div className={`text-xs font-bold ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              #{index + 1}
            </div>
            <div className={`text-sm font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              ID: {person.personId}
            </div>
            <div className={`text-lg font-black ${darkMode ? 'text-cyan-400' : 'text-blue-600'}`}>
              {person.weight} kg
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};