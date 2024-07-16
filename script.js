const arrayContainer = document.getElementById('array-container');
const comparisonCounter = document.getElementById('comparisons');
const performanceTable = document.getElementById('performance-table');
let originalArray = [];
let array = [];
let delay = 200;
let comparisons = 0;
let stop = false;
let currentAlgorithm = '';

// Object to store performance metrics for each algorithm
let performanceMetrics = {
    bubble: { comparisons: 0, time: 0 },
    selection: { comparisons: 0, time: 0 },
    quick: { comparisons: 0, time: 0 },
    merge: { comparisons: 0, time: 0 },
    heap: { comparisons: 0, time: 0 }
};

document.addEventListener('DOMContentLoaded', () => {
    generateArray();
});

function generateArray() {
    const size = document.getElementById('size').value;
    originalArray = [];
    arrayContainer.innerHTML = '';
    for (let i = 0; i < size; i++) {
        const value = Math.floor(Math.random() * 500) + 1;
        originalArray.push(value);  // Store value in originalArray
        const line = document.createElement('div');
        line.style.height = `${value}px`;
        line.style.width = '10px';
        line.classList.add('line');
        arrayContainer.appendChild(line);
    }
    resetArray();  // Initialize array to original values
    updatePerformanceTable(); // Update performance table with initial values
}

function resetArray() {
    array = [...originalArray];  // Reset working array to original values
    const lines = document.getElementsByClassName('line');
    for (let i = 0; i < array.length; i++) {
        lines[i].style.height = `${array[i]}px`;
        lines[i].style.backgroundColor = 'turquoise';
    }
    comparisons = 0;
    updateComparisonCounter();
}

function updateArray() {
    const lines = document.getElementsByClassName('line');
    for (let i = 0; i < array.length; i++) {
        lines[i].style.height = `${array[i]}px`;
        lines[i].style.backgroundColor = 'turquoise';
    }
}

function updateSpeed() {
    delay = 510 - document.getElementById('speed').value; // Speed adjustment
}

function updateComparisonCounter() {
    comparisonCounter.innerText = comparisons;
}

function updatePerformanceTable() {
    const tableRows = Object.keys(performanceMetrics).map(key => {
        const { comparisons, time } = performanceMetrics[key];
        return `<tr>
                    <td>${key}</td>
                    <td>${comparisons}</td>
                    <td>${time.toFixed(2)} ms</td>
                </tr>`;
    }).join('');
    performanceTable.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Algorithm</th>
                    <th>Comparisons</th>
                    <th>Time</th>
                </tr>
            </thead>
            <tbody>
                ${tableRows}
            </tbody>
        </table>`;
}

function stopSorting() {
    stop = true;
}

async function swap(lines, i, j) {
    [array[i], array[j]] = [array[j], array[i]];
    lines[i].style.height = `${array[i]}px`;
    lines[j].style.height = `${array[j]}px`;
    lines[i].style.backgroundColor = 'red';
    lines[j].style.backgroundColor = 'red';

    await new Promise((resolve) => setTimeout(resolve, delay));

    lines[i].style.backgroundColor = 'turquoise';
    lines[j].style.backgroundColor = 'turquoise';
}

async function selectSortingAlgorithm(algorithm) {
    stopSorting();
    await new Promise((resolve) => setTimeout(resolve, delay)); // Wait for sorting to stop

    resetArray(); // Reset array to original unsorted state before sorting
    currentAlgorithm = algorithm;
    comparisons = 0; // Reset comparisons for the current algorithm
    updateComparisonCounter();
    const startTime = performance.now(); // Start time measurement

    switch (algorithm) {
        case 'bubble':
            await bubbleSort();
            break;
        case 'selection':
            await selectionSort();
            break;
        case 'quick':
            await quickSort(0, array.length - 1);
            break;
        case 'merge':
            await mergeSort(0, array.length - 1);
            break;
        case 'heap':
            await heapSort();
            break;
        default:
            break;
    }

    const endTime = performance.now(); // End time measurement
    const executionTime = endTime - startTime;
    performanceMetrics[algorithm].comparisons += comparisons;
    performanceMetrics[algorithm].time += executionTime;

    updatePerformanceTable(); // Update performance table after sorting completes
}

async function bubbleSort() {
    stop = false;
    updateSpeed();
    const lines = document.getElementsByClassName('line');
    for (let i = 0; i < array.length - 1; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
            if (stop) return;
            comparisons++;
            updateComparisonCounter();
            if (array[j] > array[j + 1]) {
                await swap(lines, j, j + 1);
            }
        }
    }
}

async function selectionSort() {
    stop = false;
    updateSpeed();
    const lines = document.getElementsByClassName('line');
    for (let i = 0; i < array.length - 1; i++) {
        let minIdx = i;
        for (let j = i + 1; j < array.length; j++) {
            if (stop) return;
            comparisons++;
            updateComparisonCounter();
            if (array[j] < array[minIdx]) {
                minIdx = j;
            }
        }
        if (minIdx !== i) {
            await swap(lines, i, minIdx);
        }
    }
}

async function partition(low, high) {
    const lines = document.getElementsByClassName('line');
    const pivot = array[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
        if (stop) return;
        comparisons++;
        updateComparisonCounter();
        if (array[j] < pivot) {
            i++;
            await swap(lines, i, j);
        }
    }
    await swap(lines, i + 1, high);
    return i + 1;
}

async function quickSort(low, high) {
    stop = false;
    updateSpeed();
    if (low < high) {
        const pi = await partition(low, high);
        await quickSort(low, pi - 1);
        await quickSort(pi + 1, high);
    }
}

async function mergeSort(start, end) {
    stop = false;
    updateSpeed();
    if (start < end) {
        const mid = Math.floor((start + end) / 2);
        await mergeSort(start, mid);
        await mergeSort(mid + 1, end);
        await merge(start, mid, end);
    }
}

async function merge(start, mid, end) {
    const lines = document.getElementsByClassName('line');
    const left = array.slice(start, mid + 1);
    const right = array.slice(mid + 1, end + 1);
    let i = 0, j = 0, k = start;
    while (i < left.length && j < right.length) {
        if (stop) return;
        comparisons++;
        updateComparisonCounter();
        if (left[i] <= right[j]) {
            array[k] = left[i];
            lines[k].style.height = `${left[i]}px`;
            i++;
        } else {
            array[k] = right[j];
            lines[k].style.height = `${right[j]}px`;
            j++;
        }
        lines[k].style.backgroundColor = 'red';
        await new Promise((resolve) => setTimeout(resolve, delay));
        lines[k].style.backgroundColor = 'turquoise';
        k++;
    }
    while (i < left.length) {
        if (stop) return;
        array[k] = left[i];
        lines[k].style.height = `${left[i]}px`;
        lines[k].style.backgroundColor = 'red';
        await new Promise((resolve) => setTimeout(resolve, delay));
        lines[k].style.backgroundColor = 'turquoise';
        i++;
        k++;
    }
    while (j < right.length) {
        if (stop) return;
        array[k] = right[j];
        lines[k].style.height = `${right[j]}px`;
        lines[k].style.backgroundColor = 'red';
        await new Promise((resolve) => setTimeout(resolve, delay));
        lines[k].style.backgroundColor = 'turquoise';
        j++;
        k++;
    }
}

async function heapSort() {
    stop = false;
    updateSpeed();
    const lines = document.getElementsByClassName('line');
    const n = array.length;

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        if (stop) return;
        await heapify(n, i);
    }

    for (let i = n - 1; i > 0; i--) {
        if (stop) return;
        await swap(lines, 0, i);
        await heapify(i, 0);
    }
}

async function heapify(n, i) {
    const lines = document.getElementsByClassName('line');
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    comparisons++;
    updateComparisonCounter();

    if (left < n && array[left] > array[largest]) {
        largest = left;
    }

    if (right < n && array[right] > array[largest]) {
        largest = right;
    }

    if (largest !== i) {
        await swap(lines, i, largest);
        await heapify(n, largest);
    }
}
