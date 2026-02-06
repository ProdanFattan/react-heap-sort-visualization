// Animation timing constants (in milliseconds)
export const ANIMATION_DELAYS = {
  INSERT_HIGHLIGHT: 500,
  INSERT_COMPARE: 600,
  INSERT_SWAP: 800,

  EXTRACT_HIGHLIGHT: 800,
  EXTRACT_COMPARE: 600,
  EXTRACT_SWAP: 800,

  STEP_DEFAULT: 400,
  STEP_PAUSE: 400,
};

// Tree visualization layout
export const TREE_LAYOUT = {
  LEVEL_HEIGHT: 120,
  LEVEL_OFFSET: 40,
  NODE_SIZE: 20, // width and height units
  MIN_CONTAINER_HEIGHT: 400,

  // Edge/line styling
  EDGE_WIDTH_DEFAULT: 2,
  EDGE_WIDTH_HIGHLIGHTED: 3,
};

// Form validation
export const VALIDATION = {
  MIN_WEIGHT: 1,
  MAX_WEIGHT: 300,
  WEIGHT_ERROR_MESSAGES: {
    EMPTY: "Please enter a valid weight",
    NEGATIVE: "Weight must be positive",
    TOO_HIGH: "Weight seems unrealistic (max 300kg)",
  },
};

// Animation speed settings
export const PLAYBACK = {
  MIN_SPEED: 0.25,
  MAX_SPEED: 3,
  DEFAULT_SPEED: 1,
  SPEED_STEP: 0.25,
};
