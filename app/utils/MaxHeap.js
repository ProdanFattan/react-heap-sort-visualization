export class MaxHeap {
  constructor(initialData = []) {
    this.heap = [...initialData];
    // Optimize: Use bottom-up heapify O(n) instead of repeated insert O(n log n)
    if (this.heap.length > 1) {
      this.buildHeap();
    }
  }

  // Bottom-up heapify - O(n) time complexity
  buildHeap() {
    // Start from last non-leaf node and heapify down
    const startIdx = Math.floor(this.heap.length / 2) - 1;
    for (let i = startIdx; i >= 0; i--) {
      this.heapifyDown(i);
    }
  }

  getParentIndex(i) {
    return Math.floor((i - 1) / 2);
  }

  getLeftChildIndex(i) {
    return 2 * i + 1;
  }

  getRightChildIndex(i) {
    return 2 * i + 2;
  }

  swap(i, j) {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }

  insert(person) {
    this.heap.push(person);
    const path = this.heapifyUp(this.heap.length - 1);
    return path;
  }

  heapifyUp(index) {
    const path = [];
    let current = index;

    while (current > 0) {
      const parentIndex = this.getParentIndex(current);

      // Track comparison
      path.push({ type: "compare", indices: [current, parentIndex] });

      if (this.heap[current].weight > this.heap[parentIndex].weight) {
        // Track swap
        path.push({ type: "swap", indices: [current, parentIndex] });
        this.swap(current, parentIndex);
        current = parentIndex;
      } else {
        break;
      }
    }

    return path;
  }

  extractMax() {
    if (this.heap.length === 0) return { max: null, path: [] };
    if (this.heap.length === 1) return { max: this.heap.pop(), path: [] };

    const max = this.heap[0];
    this.heap[0] = this.heap.pop();
    const path = this.heapifyDownWithPath(0);

    return { max, path };
  }

  heapifyDown(index) {
    let current = index;

    while (true) {
      const leftIndex = this.getLeftChildIndex(current);
      const rightIndex = this.getRightChildIndex(current);
      let largest = current;

      if (
        leftIndex < this.heap.length &&
        this.heap[leftIndex].weight > this.heap[largest].weight
      ) {
        largest = leftIndex;
      }

      if (
        rightIndex < this.heap.length &&
        this.heap[rightIndex].weight > this.heap[largest].weight
      ) {
        largest = rightIndex;
      }

      if (largest !== current) {
        this.swap(current, largest);
        current = largest;
      } else {
        break;
      }
    }
  }

  heapifyDownWithPath(index) {
    const path = [];
    let current = index;

    while (true) {
      const leftIndex = this.getLeftChildIndex(current);
      const rightIndex = this.getRightChildIndex(current);
      let largest = current;

      // Track comparisons
      if (leftIndex < this.heap.length) {
        path.push({ type: "compare", indices: [current, leftIndex] });
        if (this.heap[leftIndex].weight > this.heap[largest].weight) {
          largest = leftIndex;
        }
      }

      if (rightIndex < this.heap.length) {
        path.push({ type: "compare", indices: [current, rightIndex] });
        if (this.heap[rightIndex].weight > this.heap[largest].weight) {
          largest = rightIndex;
        }
      }

      if (largest !== current) {
        path.push({ type: "swap", indices: [current, largest] });
        this.swap(current, largest);
        current = largest;
      } else {
        break;
      }
    }

    return path;
  }

  getHeap() {
    return [...this.heap];
  }

  size() {
    return this.heap.length;
  }
}
