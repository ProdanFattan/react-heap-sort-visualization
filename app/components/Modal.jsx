import { motion } from "framer-motion";

export const Modal = ({
  isOpen,
  onClose,
  person,
  nodeIndex,
  heap,
  darkMode,
}) => {
  if (!isOpen || !person) return null;

  // Calculate node details
  const getNodeDetails = () => {
    if (nodeIndex === undefined || !heap) return null;

    const level = Math.floor(Math.log2(nodeIndex + 1));
    const parentIndex = nodeIndex > 0 ? Math.floor((nodeIndex - 1) / 2) : null;
    const leftChildIndex = 2 * nodeIndex + 1;
    const rightChildIndex = 2 * nodeIndex + 2;

    const parent =
      parentIndex !== null && heap[parentIndex] ? heap[parentIndex] : null;
    const leftChild =
      leftChildIndex < heap.length ? heap[leftChildIndex] : null;
    const rightChild =
      rightChildIndex < heap.length ? heap[rightChildIndex] : null;

    const isRoot = nodeIndex === 0;
    const isLeaf =
      leftChildIndex >= heap.length && rightChildIndex >= heap.length;

    // Calculate heap property validation
    let heapPropertyValid = true;
    if (leftChild && person.weight < leftChild.weight)
      heapPropertyValid = false;
    if (rightChild && person.weight < rightChild.weight)
      heapPropertyValid = false;

    // Count descendants
    const countDescendants = (index) => {
      if (index >= heap.length) return 0;
      const left = 2 * index + 1;
      const right = 2 * index + 2;
      return 1 + countDescendants(left) + countDescendants(right);
    };
    const descendants = countDescendants(nodeIndex) - 1; // Exclude self

    return {
      level,
      parent,
      leftChild,
      rightChild,
      isRoot,
      isLeaf,
      heapPropertyValid,
      descendants,
    };
  };

  const details = getNodeDetails();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className={`max-w-lg w-full p-8 rounded-2xl ${
          darkMode ? "bg-slate-800" : "bg-white"
        } shadow-2xl max-h-[90vh] overflow-y-auto`}
      >
        <h2
          className={`text-3xl font-black mb-6 ${darkMode ? "text-white" : "text-slate-900"}`}
        >
          Node Details
        </h2>

        <div className="space-y-3">
          {/* Person Info */}
          <div
            className={`p-4 rounded-lg ${darkMode ? "bg-gradient-to-r from-cyan-900/50 to-blue-900/50" : "bg-gradient-to-r from-cyan-50 to-blue-50"}`}
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div
                  className={`text-xs font-bold ${darkMode ? "text-slate-400" : "text-slate-600"}`}
                >
                  Person ID
                </div>
                <div
                  className={`text-xl font-black ${darkMode ? "text-cyan-400" : "text-blue-600"}`}
                >
                  {person.personId}
                </div>
              </div>
              <div>
                <div
                  className={`text-xs font-bold ${darkMode ? "text-slate-400" : "text-slate-600"}`}
                >
                  Weight
                </div>
                <div
                  className={`text-xl font-black ${darkMode ? "text-cyan-400" : "text-blue-600"}`}
                >
                  {person.weight} kg
                </div>
              </div>
            </div>
          </div>

          {details && (
            <>
              {/* Position Info */}
              <div
                className={`p-4 rounded-lg ${darkMode ? "bg-slate-700" : "bg-slate-50"}`}
              >
                <h3
                  className={`text-sm font-black mb-3 ${darkMode ? "text-white" : "text-slate-900"}`}
                >
                  Position
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div
                      className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-600"}`}
                    >
                      Array Index
                    </div>
                    <div
                      className={`text-lg font-bold ${darkMode ? "text-white" : "text-slate-900"}`}
                    >
                      {nodeIndex}
                    </div>
                  </div>
                  <div>
                    <div
                      className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-600"}`}
                    >
                      Tree Level
                    </div>
                    <div
                      className={`text-lg font-bold ${darkMode ? "text-white" : "text-slate-900"}`}
                    >
                      {details.level}
                    </div>
                  </div>
                  <div>
                    <div
                      className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-600"}`}
                    >
                      Node Type
                    </div>
                    <div
                      className={`text-sm font-bold ${darkMode ? "text-cyan-400" : "text-blue-600"}`}
                    >
                      {details.isRoot
                        ? "👑 Root"
                        : details.isLeaf
                          ? "🍃 Leaf"
                          : "🌿 Internal"}
                    </div>
                  </div>
                  <div>
                    <div
                      className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-600"}`}
                    >
                      Descendants
                    </div>
                    <div
                      className={`text-lg font-bold ${darkMode ? "text-white" : "text-slate-900"}`}
                    >
                      {details.descendants}
                    </div>
                  </div>
                </div>
              </div>

              {/* Heap Property */}
              <div
                className={`p-4 rounded-lg ${darkMode ? "bg-slate-700" : "bg-slate-50"}`}
              >
                <h3
                  className={`text-sm font-black mb-2 ${darkMode ? "text-white" : "text-slate-900"}`}
                >
                  Heap Property
                </h3>
                <div className={`flex items-center gap-2`}>
                  <span className="text-2xl">
                    {details.heapPropertyValid ? "✅" : "❌"}
                  </span>
                  <span
                    className={`text-sm font-bold ${
                      details.heapPropertyValid
                        ? darkMode
                          ? "text-green-400"
                          : "text-green-600"
                        : darkMode
                          ? "text-red-400"
                          : "text-red-600"
                    }`}
                  >
                    {details.heapPropertyValid
                      ? "Valid: Parent ≥ Children"
                      : "Invalid: Heap property violated"}
                  </span>
                </div>
              </div>

              {/* Parent */}
              {details.parent && (
                <div
                  className={`p-4 rounded-lg ${darkMode ? "bg-slate-700" : "bg-slate-50"}`}
                >
                  <h3
                    className={`text-sm font-black mb-2 ${darkMode ? "text-white" : "text-slate-900"}`}
                  >
                    🔼 Parent
                  </h3>
                  <div className="flex justify-between items-center">
                    <div>
                      <div
                        className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-600"}`}
                      >
                        ID: {details.parent.personId}
                      </div>
                      <div
                        className={`text-lg font-bold ${darkMode ? "text-cyan-400" : "text-blue-600"}`}
                      >
                        {details.parent.weight} kg
                      </div>
                    </div>
                    <div
                      className={`text-xs ${darkMode ? "text-slate-500" : "text-slate-500"}`}
                    >
                      Index: {Math.floor((nodeIndex - 1) / 2)}
                    </div>
                  </div>
                </div>
              )}

              {/* Children */}
              {(details.leftChild || details.rightChild) && (
                <div
                  className={`p-4 rounded-lg ${darkMode ? "bg-slate-700" : "bg-slate-50"}`}
                >
                  <h3
                    className={`text-sm font-black mb-3 ${darkMode ? "text-white" : "text-slate-900"}`}
                  >
                    🔽 Children
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {details.leftChild && (
                      <div
                        className={`p-3 rounded ${darkMode ? "bg-slate-600" : "bg-white"}`}
                      >
                        <div
                          className={`text-xs font-bold mb-1 ${darkMode ? "text-slate-400" : "text-slate-600"}`}
                        >
                          Left Child
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <span
                              className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-600"}`}
                            >
                              ID: {details.leftChild.personId}
                            </span>
                            <span
                              className={`ml-4 text-lg font-bold ${darkMode ? "text-cyan-400" : "text-blue-600"}`}
                            >
                              {details.leftChild.weight} kg
                            </span>
                          </div>
                          <div
                            className={`text-xs ${darkMode ? "text-slate-500" : "text-slate-500"}`}
                          >
                            Index: {2 * nodeIndex + 1}
                          </div>
                        </div>
                      </div>
                    )}
                    {details.rightChild && (
                      <div
                        className={`p-3 rounded ${darkMode ? "bg-slate-600" : "bg-white"}`}
                      >
                        <div
                          className={`text-xs font-bold mb-1 ${darkMode ? "text-slate-400" : "text-slate-600"}`}
                        >
                          Right Child
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <span
                              className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-600"}`}
                            >
                              ID: {details.rightChild.personId}
                            </span>
                            <span
                              className={`ml-4 text-lg font-bold ${darkMode ? "text-cyan-400" : "text-blue-600"}`}
                            >
                              {details.rightChild.weight} kg
                            </span>
                          </div>
                          <div
                            className={`text-xs ${darkMode ? "text-slate-500" : "text-slate-500"}`}
                          >
                            Index: {2 * nodeIndex + 2}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <button
          onClick={onClose}
          className={`w-full mt-6 py-3 rounded-lg font-bold transition-all transform hover:scale-105 active:scale-95
            ${
              darkMode
                ? "bg-slate-700 hover:bg-slate-600 text-white"
                : "bg-slate-200 hover:bg-slate-300 text-slate-900"
            }`}
        >
          Close
        </button>
      </motion.div>
    </motion.div>
  );
};
