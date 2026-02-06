import { useMemo } from "react";
import { TreeNode } from "./TreeNode";
import { TREE_LAYOUT } from "../utils/animationConfig";

export const HeapTreeVisualization = ({
  heap,
  highlighted,
  extractingIndex,
  comparingNodes = [],
  swappingNodes = [],
  darkMode,
  onNodeClick,
}) => {
  // Helper function to calculate node position
  const getNodePosition = useMemo(
    () => (index) => {
      const level = Math.floor(Math.log2(index + 1));
      const levelSize = Math.pow(2, level);
      const positionInLevel = index - (levelSize - 1);
      const x = ((positionInLevel + 1) * 100) / (levelSize + 1);
      const y = level * TREE_LAYOUT.LEVEL_HEIGHT + TREE_LAYOUT.LEVEL_OFFSET;
      return { x, y, level, levelSize };
    },
    [],
  );

  // Helper function to render a single edge (DRY - eliminates duplication)
  const renderEdge = (parentIndex, childIndex, parentPos, childPos) => {
    const isSwappingEdge =
      swappingNodes.includes(parentIndex) && swappingNodes.includes(childIndex);
    const isComparingEdge =
      comparingNodes.includes(parentIndex) &&
      comparingNodes.includes(childIndex);
    const isHighlightedEdge =
      highlighted.includes(parentIndex) && highlighted.includes(childIndex);

    return (
      <line
        key={`line-${parentIndex}-${childIndex}`}
        x1={`${parentPos.x}%`}
        y1={parentPos.y}
        x2={`${childPos.x}%`}
        y2={childPos.y}
        className={`${
          isSwappingEdge
            ? darkMode
              ? "stroke-green-400"
              : "stroke-green-500"
            : isComparingEdge
              ? darkMode
                ? "stroke-yellow-400"
                : "stroke-yellow-500"
              : isHighlightedEdge
                ? darkMode
                  ? "stroke-cyan-400"
                  : "stroke-blue-500"
                : darkMode
                  ? "stroke-slate-700"
                  : "stroke-slate-300"
        } transition-all duration-300`}
        strokeWidth={
          isSwappingEdge || isComparingEdge
            ? TREE_LAYOUT.EDGE_WIDTH_HIGHLIGHTED
            : TREE_LAYOUT.EDGE_WIDTH_DEFAULT
        }
      />
    );
  };

  const renderLevel = (startIndex, levelSize, level) => {
    const nodes = [];

    for (let i = 0; i < levelSize && startIndex + i < heap.length; i++) {
      const index = startIndex + i;
      const person = heap[index];

      nodes.push(
        <div
          key={`node-${index}`}
          style={{
            position: "absolute",
            left: `${((i + 1) * 100) / (levelSize + 1)}%`,
            transform: "translateX(-50%)",
          }}
        >
          <TreeNode
            person={person}
            index={index}
            highlighted={highlighted}
            isExtracting={extractingIndex === index}
            isComparing={comparingNodes.includes(index)}
            isSwapping={swappingNodes.includes(index)}
            darkMode={darkMode}
            onClick={onNodeClick}
          />
        </div>,
      );
    }

    return nodes;
  };

  // Memoize connections to avoid recalculating on every render
  const connections = useMemo(() => {
    const result = [];

    for (let i = 0; i < heap.length; i++) {
      const leftChild = 2 * i + 1;
      const rightChild = 2 * i + 2;

      if (leftChild < heap.length || rightChild < heap.length) {
        const parentPos = getNodePosition(i);

        // Render left child edge
        if (leftChild < heap.length) {
          const childPos = getNodePosition(leftChild);
          result.push(renderEdge(i, leftChild, parentPos, childPos));
        }

        // Render right child edge
        if (rightChild < heap.length) {
          const childPos = getNodePosition(rightChild);
          result.push(renderEdge(i, rightChild, parentPos, childPos));
        }
      }
    }

    return result;
  }, [
    heap.length,
    swappingNodes,
    comparingNodes,
    highlighted,
    darkMode,
    getNodePosition,
  ]);

  const levels = Math.ceil(Math.log2(heap.length + 1));
  const height = levels * TREE_LAYOUT.LEVEL_HEIGHT + 100;

  return (
    <div
      className="relative w-full"
      style={{
        height: `${height}px`,
        minHeight: `${TREE_LAYOUT.MIN_CONTAINER_HEIGHT}px`,
      }}
    >
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {connections}
      </svg>

      {Array.from({ length: levels }).map((_, level) => {
        const startIndex = Math.pow(2, level) - 1;
        const levelSize = Math.pow(2, level);

        return (
          <div
            key={`level-${level}`}
            className="relative"
            style={{
              position: "absolute",
              top: `${level * TREE_LAYOUT.LEVEL_HEIGHT}px`,
              left: 0,
              right: 0,
              height: "100px",
            }}
          >
            {renderLevel(startIndex, levelSize, level)}
          </div>
        );
      })}
    </div>
  );
};
