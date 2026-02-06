"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MaxHeap } from "../app/utils/MaxHeap";
import { INITIAL_DATA } from "../app/utils/constants";
import { ANIMATION_DELAYS } from "../app/utils/animationConfig";
import { HeapTreeVisualization } from "../app/components/HeapTreeVisualization";
import { AddPersonForm } from "../app/components/AddPersonForm";
import { SortedList } from "../app/components/SortedList";
import { Modal } from "../app/components/Modal";
import { PlaybackControls } from "../app/components/PlaybackControls";

export default function HeapVisualizer() {
  // Initialize heap with lazy initialization to avoid setState in effect
  const [heapInstance, setHeapInstance] = useState(() => new MaxHeap(INITIAL_DATA));
  const [heap, setHeap] = useState(() => new MaxHeap(INITIAL_DATA).getHeap());
  const [nextId, setNextId] = useState(31);
  const [highlighted, setHighlighted] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [isSorting, setSorting] = useState(false);
  const [extractingIndex, setExtractingIndex] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [selectedNodeIndex, setSelectedNodeIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [comparingNodes, setComparingNodes] = useState([]);
  const [swappingNodes, setSwappingNodes] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const [sortSteps, setSortSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);

  // Track if component is mounted to prevent setState on unmounted component
  const isMountedRef = useRef(true);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Reset to initial data
  const handleReset = useCallback(() => {
    const newHeap = new MaxHeap(INITIAL_DATA);
    setHeapInstance(newHeap);
    setHeap(newHeap.getHeap());
    setNextId(31);
    setHighlighted([]);
    setSortedData([]);
    setSorting(false);
    setExtractingIndex(null);
    setComparingNodes([]);
    setSwappingNodes([]);
    setIsPaused(false);
    setSortSteps([]);
    setCurrentStepIndex(-1);
    setIsPlaying(false);
  }, []);

  // Add new person
  const handleAddPerson = useCallback(
    async (weight) => {
      if (!heapInstance || isSorting) return;

      const newPerson = { personId: nextId, weight };
      const newHeap = new MaxHeap(heapInstance.getHeap());

      // Insert and get the path of operations
      const path = newHeap.insert(newPerson);
      const updatedHeap = newHeap.getHeap();

      // Find the inserted node's starting position (before bubble-up)
      const insertedIndex = updatedHeap.length - 1;

      // Highlight the newly inserted node
      if (!isMountedRef.current) return;
      setHeap(updatedHeap);
      setHighlighted([insertedIndex]);
      await new Promise((resolve) => setTimeout(resolve, ANIMATION_DELAYS.INSERT_HIGHLIGHT));

      // Animate the heapify-up process
      if (path && path.length > 0) {
        for (const operation of path) {
          if (!isMountedRef.current) return;

          if (operation.type === "compare") {
            // Highlight nodes being compared
            setComparingNodes(operation.indices);
            setHighlighted(operation.indices);
            await new Promise((resolve) => setTimeout(resolve, ANIMATION_DELAYS.INSERT_COMPARE));
            if (!isMountedRef.current) return;
            setComparingNodes([]);
          } else if (operation.type === "swap") {
            // Highlight nodes being swapped
            setSwappingNodes(operation.indices);
            setHighlighted(operation.indices);
            await new Promise((resolve) => setTimeout(resolve, ANIMATION_DELAYS.INSERT_SWAP));
            if (!isMountedRef.current) return;
            setSwappingNodes([]);
          }
        }
      }

      if (!isMountedRef.current) return;
      setHeapInstance(newHeap);
      setHeap(updatedHeap);
      setNextId(nextId + 1);
      setHighlighted([]);
    },
    [heapInstance, nextId, isSorting],
  );

  // Generate all steps for heap sort
  const generateSortSteps = useCallback(() => {
    if (!heapInstance || heapInstance.size() === 0) return [];

    const steps = [];
    const sorted = [];
    const workingHeap = new MaxHeap(heapInstance.getHeap());

    while (workingHeap.size() > 0) {
      // Step: Highlight root being extracted
      steps.push({
        type: 'extract_start',
        heap: [...workingHeap.getHeap()],
        sorted: [...sorted],
        extractingIndex: 0,
        highlighted: [0],
      });

      // Extract max and get the path of operations
      const { max, path } = workingHeap.extractMax();

      if (max) {
        sorted.push(max);
      }

      const currentHeap = workingHeap.getHeap();

      // Step: Show heap after extraction (before heapify down)
      steps.push({
        type: 'extract_end',
        heap: [...currentHeap],
        sorted: [...sorted],
        extractingIndex: null,
        highlighted: [],
      });

      // Generate steps for heapify down operations
      if (currentHeap.length > 0 && path && path.length > 0) {
        for (const operation of path) {
          if (operation.type === "compare") {
            steps.push({
              type: 'compare',
              heap: [...workingHeap.getHeap()],
              sorted: [...sorted],
              comparingNodes: operation.indices,
              highlighted: operation.indices,
            });
          } else if (operation.type === "swap") {
            steps.push({
              type: 'swap',
              heap: [...workingHeap.getHeap()],
              sorted: [...sorted],
              swappingNodes: operation.indices,
              highlighted: operation.indices,
            });
          }
        }
      }
    }

    // Final step
    steps.push({
      type: 'complete',
      heap: [],
      sorted: [...sorted],
      highlighted: [],
    });

    return steps;
  }, [heapInstance]);

  // Start heap sort - generate steps
  const handleHeapSort = useCallback(() => {
    if (!heapInstance || isSorting || heapInstance.size() === 0) return;

    const steps = generateSortSteps();
    setSortSteps(steps);
    setCurrentStepIndex(0);
    setSorting(true);
    setIsPaused(false);
    setIsPlaying(true);
    setSortedData([]);
  }, [heapInstance, isSorting, generateSortSteps]);

  // Execute a specific step
  const executeStep = useCallback((step) => {
    if (!step) return;

    setHeap(step.heap || []);
    setSortedData(step.sorted || []);
    setHighlighted(step.highlighted || []);
    setExtractingIndex(step.extractingIndex !== undefined ? step.extractingIndex : null);
    setComparingNodes(step.comparingNodes || []);
    setSwappingNodes(step.swappingNodes || []);

    if (step.type === 'complete') {
      setSorting(false);
      setIsPlaying(false);
    }
  }, []);

  // Auto-advance steps when playing
  // Intentional setState in effect for animation loop management
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!isPlaying || isPaused || currentStepIndex === -1) return;
    if (currentStepIndex >= sortSteps.length) {
      setIsPlaying(false);
      setSorting(false);
      return;
    }

    const step = sortSteps[currentStepIndex];
    executeStep(step);

    // Calculate delay based on step type and speed
    let delay = ANIMATION_DELAYS.STEP_DEFAULT;
    if (step.type === 'extract_start') delay = ANIMATION_DELAYS.EXTRACT_HIGHLIGHT;
    else if (step.type === 'compare') delay = ANIMATION_DELAYS.EXTRACT_COMPARE;
    else if (step.type === 'swap') delay = ANIMATION_DELAYS.EXTRACT_SWAP;

    delay = delay / animationSpeed;

    const timer = setTimeout(() => {
      setCurrentStepIndex((prev) => prev + 1);
    }, delay);

    return () => clearTimeout(timer);
  }, [isPlaying, isPaused, currentStepIndex, sortSteps, executeStep, animationSpeed]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Playback controls
  const handlePlayPause = useCallback(() => {
    if (!isSorting) return;

    if (isPaused) {
      // When resuming from pause, advance to next step instead of re-executing current
      setIsPaused(false);
      setIsPlaying(true);
      if (currentStepIndex < sortSteps.length - 1) {
        setCurrentStepIndex((prev) => prev + 1);
      }
    } else {
      // When pausing, just set isPaused
      setIsPaused(true);
      setIsPlaying(false);
    }
  }, [isSorting, isPaused, currentStepIndex, sortSteps.length]);

  const handleStepForward = useCallback(() => {
    if (currentStepIndex < sortSteps.length - 1) {
      setIsPaused(true);
      setIsPlaying(false);
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      executeStep(sortSteps[nextIndex]);
    }
  }, [currentStepIndex, sortSteps, executeStep]);

  const handleStepBackward = useCallback(() => {
    if (currentStepIndex > 0) {
      setIsPaused(true);
      setIsPlaying(false);
      const prevIndex = currentStepIndex - 1;
      setCurrentStepIndex(prevIndex);
      executeStep(sortSteps[prevIndex]);
    }
  }, [currentStepIndex, sortSteps, executeStep]);

  const handleSpeedChange = useCallback((speed) => {
    setAnimationSpeed(speed);
  }, []);

  // Export as JSON
  const handleExport = useCallback(() => {
    const data = {
      heap: heap,
      sorted: sortedData,
      timestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `heap-data-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [heap, sortedData]);

  const handleNodeClick = useCallback((person, index) => {
    setSelectedPerson(person);
    setSelectedNodeIndex(index);
    setShowModal(true);
  }, []);

  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => !prev);
  }, []);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode
          ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
          : "bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50"
      }`}
    >
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h1
              className={`text-5xl font-black ${darkMode ? "text-white" : "text-slate-900"}`}
            >
              Max-Heap Visualizer
            </h1>

            <button
              onClick={toggleDarkMode}
              className={`p-3 rounded-lg transition-all transform hover:scale-110 active:scale-95
                ${
                  darkMode
                    ? "bg-slate-800 text-yellow-400 hover:bg-slate-700"
                    : "bg-white text-slate-700 hover:bg-slate-100 shadow-md"
                }`}
            >
              {darkMode ? "☀️" : "🌙"}
            </button>
          </div>

          <p
            className={`text-lg ${darkMode ? "text-slate-400" : "text-slate-600"}`}
          >
            Interactive binary heap data structure with real-time visualization
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <div
            className={`p-6 rounded-xl ${darkMode ? "bg-slate-800" : "bg-white shadow-xl"}`}
          >
            <div
              className={`text-sm font-bold mb-2 ${darkMode ? "text-slate-400" : "text-slate-600"}`}
            >
              Heap Size
            </div>
            <div
              className={`text-4xl font-black ${darkMode ? "text-cyan-400" : "text-blue-600"}`}
            >
              {heap.length}
            </div>
          </div>

          <div
            className={`p-6 rounded-xl ${darkMode ? "bg-slate-800" : "bg-white shadow-xl"}`}
          >
            <div
              className={`text-sm font-bold mb-2 ${darkMode ? "text-slate-400" : "text-slate-600"}`}
            >
              Max Weight
            </div>
            <div
              className={`text-4xl font-black ${darkMode ? "text-cyan-400" : "text-blue-600"}`}
            >
              {heap.length > 0 ? `${heap[0].weight} kg` : "—"}
            </div>
          </div>

          <div
            className={`p-6 rounded-xl ${darkMode ? "bg-slate-800" : "bg-white shadow-xl"}`}
          >
            <div
              className={`text-sm font-bold mb-2 ${darkMode ? "text-slate-400" : "text-slate-600"}`}
            >
              Sorted Count
            </div>
            <div
              className={`text-4xl font-black ${darkMode ? "text-cyan-400" : "text-blue-600"}`}
            >
              {sortedData.length}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Controls */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Add Person */}
            <div
              className={`p-6 rounded-xl ${darkMode ? "bg-slate-800" : "bg-white shadow-xl"}`}
            >
              <h2
                className={`text-xl font-black mb-4 ${darkMode ? "text-white" : "text-slate-900"}`}
              >
                Add Person
              </h2>
              <AddPersonForm
                onAdd={handleAddPerson}
                nextId={nextId}
                darkMode={darkMode}
                disabled={isSorting}
              />
            </div>

            {/* Actions */}
            <div
              className={`p-6 rounded-xl ${darkMode ? "bg-slate-800" : "bg-white shadow-xl"}`}
            >
              <h2
                className={`text-xl font-black mb-4 ${darkMode ? "text-white" : "text-slate-900"}`}
              >
                Actions
              </h2>

              <div className="space-y-3">
                <button
                  onClick={handleHeapSort}
                  disabled={isSorting || heap.length === 0}
                  className={`w-full py-3 rounded-lg font-bold transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                    ${
                      darkMode
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-900/50"
                        : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg shadow-purple-500/50"
                    }`}
                >
                  {isSorting ? "Sorting..." : "Run Heap Sort"}
                </button>

                <button
                  onClick={handleReset}
                  disabled={isSorting && !isPaused}
                  className={`w-full py-3 rounded-lg font-bold transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
                    ${
                      darkMode
                        ? "bg-slate-700 hover:bg-slate-600 text-white"
                        : "bg-slate-200 hover:bg-slate-300 text-slate-900 shadow-md"
                    }`}
                >
                  Reset to Initial
                </button>

                <button
                  onClick={handleExport}
                  className={`w-full py-3 rounded-lg font-bold transition-all transform hover:scale-105 active:scale-95
                    ${
                      darkMode
                        ? "bg-slate-700 hover:bg-slate-600 text-white"
                        : "bg-slate-200 hover:bg-slate-300 text-slate-900 shadow-md"
                    }`}
                >
                  Export JSON
                </button>
              </div>
            </div>

            {/* Playback Controls */}
            <PlaybackControls
              isSorting={isSorting}
              isPaused={isPaused}
              currentStep={currentStepIndex}
              totalSteps={sortSteps.length}
              animationSpeed={animationSpeed}
              onPlayPause={handlePlayPause}
              onStepForward={handleStepForward}
              onStepBackward={handleStepBackward}
              onSpeedChange={handleSpeedChange}
              darkMode={darkMode}
            />
          </motion.div>

          {/* Main Content - Heap Visualization */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-3 space-y-8"
          >
            {/* Heap Tree */}
            <div
              className={`p-8 rounded-xl ${darkMode ? "bg-slate-800" : "bg-white shadow-xl"} overflow-x-auto`}
            >
              <h2
                className={`text-2xl font-black mb-6 ${darkMode ? "text-white" : "text-slate-900"}`}
              >
                Binary Heap Tree
              </h2>

              {heap.length > 0 ? (
                <HeapTreeVisualization
                  heap={heap}
                  highlighted={highlighted}
                  extractingIndex={extractingIndex}
                  comparingNodes={comparingNodes}
                  swappingNodes={swappingNodes}
                  darkMode={darkMode}
                  onNodeClick={handleNodeClick}
                />
              ) : (
                <div
                  className={`text-center py-20 ${darkMode ? "text-slate-500" : "text-slate-400"}`}
                >
                  <div className="text-6xl mb-4">🌳</div>
                  <div className="text-xl font-bold">Heap is empty</div>
                  <div>Add some people to see the tree visualization</div>
                </div>
              )}
            </div>

            {/* Sorted List */}
            <AnimatePresence>
              {sortedData.length > 0 && (
                <SortedList sortedData={sortedData} darkMode={darkMode} />
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <Modal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            person={selectedPerson}
            nodeIndex={selectedNodeIndex}
            heap={heap}
            darkMode={darkMode}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
