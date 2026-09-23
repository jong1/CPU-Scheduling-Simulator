/* ============================================================
   CPU SCHEDULING SIMULATOR
   COMPLETE JAVASCRIPT
   ============================================================ */


/* ============================================================
   GLOBAL STATE
   ============================================================ */

let processes = [];

let simulationResult = null;

let processCounter = 1;


/* ============================================================
   DOM ELEMENTS
   ============================================================ */

const processTableBody =
    document.getElementById("processTableBody");

const emptyState =
    document.getElementById("emptyState");

const addProcessBtn =
    document.getElementById("addProcessBtn");

const loadSampleBtn =
    document.getElementById("loadSampleBtn");

const clearAllBtn =
    document.getElementById("clearAllBtn");

const algorithmSelect =
    document.getElementById("algorithmSelect");

const quantumGroup =
    document.getElementById("quantumGroup");

const quantumInput =
    document.getElementById("quantumInput");

const runSimulationBtn =
    document.getElementById("runSimulationBtn");

const compareBtn =
    document.getElementById("compareBtn");

const algorithmInfo =
    document.getElementById("algorithmInfo");

const messageBox =
    document.getElementById("messageBox");

const messageText =
    document.getElementById("messageText");

const ganttContainer =
    document.getElementById("ganttContainer");

const metricsTableBody =
    document.getElementById("metricsTableBody");

const comparisonTableBody =
    document.getElementById("comparisonTableBody");

const processCount =
    document.getElementById("processCount");

const algorithmStat =
    document.getElementById("algorithmStat");

const avgWaitingStat =
    document.getElementById("avgWaitingStat");

const avgResponseStat =
    document.getElementById("avgResponseStat");

const avgWaitingMetric =
    document.getElementById("avgWaitingMetric");

const avgTurnaroundMetric =
    document.getElementById("avgTurnaroundMetric");

const avgResponseMetric =
    document.getElementById("avgResponseMetric");

const cpuUtilizationMetric =
    document.getElementById("cpuUtilizationMetric");


/* ============================================================
   ALGORITHM INFORMATION
   ============================================================ */

const algorithmDescriptions = {

    FCFS: {

        title: "FCFS",

        description:
            "Processes execute according to arrival order."

    },


    SJF: {

        title: "SJF",

        description:
            "The available process with the shortest burst time executes first."

    },


    SRTF: {

        title: "SRTF",

        description:
            "The process with the shortest remaining time executes next and may be preempted."

    },


    RR: {

        title: "Round Robin",

        description:
            "Processes receive CPU time in rotating order using the selected time quantum."

    },


    PRIORITY: {

        title: "Priority",

        description:
            "The available process with the highest priority executes first. Lower number means higher priority."

    }

};


/* ============================================================
   UTILITY FUNCTIONS
   ============================================================ */


/**
 * Safely convert a value into a number.
 */
function toNumber(value, fallback = 0) {

    const number = Number(value);

    return Number.isFinite(number)
        ? number
        : fallback;

}


/**
 * Format a numeric result.
 */
function formatNumber(value) {

    if (
        value === null ||
        value === undefined ||
        Number.isNaN(Number(value))
    ) {

        return "—";

    }

    return Number(value).toFixed(2);

}


/**
 * Escape HTML to prevent invalid markup.
 */
function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/**
 * Generate a new process ID.
 */
function generatePID() {

    let pid;

    do {

        pid = `P${processCounter}`;

        processCounter++;

    } while (
        processes.some(
            process => process.pid === pid
        )
    );

    return pid;

}


/* ============================================================
   MESSAGE SYSTEM
   ============================================================ */

function showMessage(message, type = "info") {

    messageText.textContent = message;

    messageBox.classList.remove(
        "success",
        "error"
    );

    if (type === "success") {

        messageBox.style.background = "#effbf6";
        messageBox.style.borderColor = "#d4f1e5";
        messageBox.style.color = "#4e806d";

    }
    else if (type === "error") {

        messageBox.style.background = "#fff4f4";
        messageBox.style.borderColor = "#ffdcdc";
        messageBox.style.color = "#b45a5a";

    }
    else {

        messageBox.style.background = "#f5f9ff";
        messageBox.style.borderColor = "#dce9fc";
        messageBox.style.color = "#7586a5";

    }

}


/* ============================================================
   PROCESS MANAGEMENT
   ============================================================ */


/**
 * Add a process.
 */
function addProcess(
    pid = null,
    arrivalTime = 0,
    burstTime = 1,
    priority = 1
) {

    const newProcess = {

        pid: pid || generatePID(),

        arrivalTime: Math.max(
            0,
            Math.floor(
                toNumber(arrivalTime, 0)
            )
        ),

        burstTime: Math.max(
            1,
            Math.floor(
                toNumber(burstTime, 1)
            )
        ),

        priority: Math.max(
            1,
            Math.floor(
                toNumber(priority, 1)
            )
        ),

        inputOrder: processes.length

    };


    processes.push(newProcess);

    renderProcessTable();

    updateDashboard();

}


/**
 * Delete a process.
 */
function deleteProcess(index) {

    if (
        index < 0 ||
        index >= processes.length
    ) {

        return;

    }


    processes.splice(index, 1);

    processes.forEach(
        (process, i) => {
            process.inputOrder = i;
        }
    );


    renderProcessTable();

    updateDashboard();

    clearSimulationOutput();

    showMessage(
        "Process removed.",
        "info"
    );

}


/**
 * Remove all processes.
 */
function clearAll() {

    processes = [];

    processCounter = 1;

    simulationResult = null;

    renderProcessTable();

    updateDashboard();

    clearSimulationOutput();

    showMessage(
        "All processes have been cleared.",
        "info"
    );

}


/**
 * Load sample data.
 */
function loadSample() {

    processes = [];

    processCounter = 1;

    simulationResult = null;


    const sampleData = [

        {
            pid: "P1",
            arrivalTime: 0,
            burstTime: 8,
            priority: 2
        },

        {
            pid: "P2",
            arrivalTime: 1,
            burstTime: 4,
            priority: 1
        },

        {
            pid: "P3",
            arrivalTime: 2,
            burstTime: 2,
            priority: 3
        },

        {
            pid: "P4",
            arrivalTime: 3,
            burstTime: 5,
            priority: 2
        },

        {
            pid: "P5",
            arrivalTime: 4,
            burstTime: 3,
            priority: 1
        }

    ];


    sampleData.forEach(
        (item, index) => {

            processes.push({

                ...item,

                inputOrder: index

            });

        }
    );


    processCounter = 6;

    renderProcessTable();

    updateDashboard();

    clearSimulationOutput();

    showMessage(
        "Sample processes loaded successfully.",
        "success"
    );

}


/* ============================================================
   RENDER PROCESS TABLE
   ============================================================ */

function renderProcessTable() {

    processTableBody.innerHTML = "";


    if (processes.length === 0) {

        emptyState.style.display = "block";

        return;

    }


    emptyState.style.display = "none";


    processes.forEach(
        (process, index) => {

            const row =
                document.createElement("tr");

            row.className = "fade-in";


            row.innerHTML = `

                <td>

                    <input
                        type="text"
                        class="process-input pid-input"
                        value="${escapeHTML(process.pid)}"
                        data-index="${index}"
                        data-field="pid"
                    >

                </td>


                <td>

                    <input
                        type="number"
                        class="process-input"
                        min="0"
                        step="1"
                        value="${process.arrivalTime}"
                        data-index="${index}"
                        data-field="arrivalTime"
                    >

                </td>


                <td>

                    <input
                        type="number"
                        class="process-input"
                        min="1"
                        step="1"
                        value="${process.burstTime}"
                        data-index="${index}"
                        data-field="burstTime"
                    >

                </td>


                <td>

                    <input
                        type="number"
                        class="process-input"
                        min="1"
                        step="1"
                        value="${process.priority}"
                        data-index="${index}"
                        data-field="priority"
                    >

                </td>


                <td>

                    <button
                        type="button"
                        class="delete-process"
                        data-delete-index="${index}"
                        title="Delete process"
                    >
                        ×
                    </button>

                </td>

            `;


            processTableBody.appendChild(row);

        }
    );

}


/* ============================================================
   PROCESS TABLE INPUT EVENTS
   ============================================================ */

processTableBody.addEventListener(
    "input",
    function(event) {

        const input =
            event.target.closest(
                ".process-input"
            );


        if (!input) {

            return;

        }


        const index =
            Number(input.dataset.index);

        const field =
            input.dataset.field;


        if (
            !Number.isInteger(index) ||
            !processes[index]
        ) {

            return;

        }


        if (field === "pid") {

            processes[index].pid =
                input.value.trim() ||
                `P${index + 1}`;

        }
        else if (field === "arrivalTime") {

            processes[index].arrivalTime =
                Math.max(
                    0,
                    Math.floor(
                        toNumber(
                            input.value,
                            0
                        )
                    )
                );

        }
        else if (field === "burstTime") {

            processes[index].burstTime =
                Math.max(
                    1,
                    Math.floor(
                        toNumber(
                            input.value,
                            1
                        )
                    )
                );

        }
        else if (field === "priority") {

            processes[index].priority =
                Math.max(
                    1,
                    Math.floor(
                        toNumber(
                            input.value,
                            1
                        )
                    )
                );

        }


        updateDashboard();

        clearSimulationOutput();

    }
);


/* ============================================================
   DELETE BUTTON EVENT
   ============================================================ */

processTableBody.addEventListener(
    "click",
    function(event) {

        const button =
            event.target.closest(
                "[data-delete-index]"
            );


        if (!button) {

            return;

        }


        const index =
            Number(
                button.dataset.deleteIndex
            );


        deleteProcess(index);

    }
);


/* ============================================================
   DASHBOARD
   ============================================================ */

function updateDashboard() {

    processCount.textContent =
        processes.length;


    const selectedAlgorithm =
        algorithmSelect.value;


    algorithmStat.textContent =
        getAlgorithmShortName(
            selectedAlgorithm
        );


    if (
        simulationResult &&
        simulationResult.metrics
    ) {

        avgWaitingStat.textContent =
            formatNumber(
                simulationResult.averages.waiting
            );

        avgResponseStat.textContent =
            formatNumber(
                simulationResult.averages.response
            );

    }
    else {

        avgWaitingStat.textContent =
            "—";

        avgResponseStat.textContent =
            "—";

    }

}


/* ============================================================
   ALGORITHM NAME
   ============================================================ */

function getAlgorithmShortName(
    algorithm
) {

    switch (algorithm) {

        case "FCFS":
            return "FCFS";

        case "SJF":
            return "SJF";

        case "SRTF":
            return "SRTF";

        case "RR":
            return "Round Robin";

        case "PRIORITY":
            return "Priority";

        default:
            return algorithm;

    }

}


/* ============================================================
   ALGORITHM CONFIGURATION
   ============================================================ */

function updateAlgorithmUI() {

    const algorithm =
        algorithmSelect.value;


    const info =
        algorithmDescriptions[algorithm];


    if (info) {

        algorithmInfo.innerHTML = `

            <div class="info-icon">
                i
            </div>

            <div>

                <strong>
                    ${escapeHTML(info.title)}
                </strong>

                <span>
                    ${escapeHTML(info.description)}
                </span>

            </div>

        `;

    }


    if (algorithm === "RR") {

        quantumGroup.style.display =
            "block";

    }
    else {

        quantumGroup.style.display =
            "none";

    }


    algorithmStat.textContent =
        getAlgorithmShortName(
            algorithm
        );

}


/* ============================================================
   VALIDATION
   ============================================================ */

function validateProcesses() {

    if (processes.length === 0) {

        return {
            valid: false,
            message:
                "Please add at least one process before running the simulation."
        };

    }


    const pidSet =
        new Set();


    for (
        let i = 0;
        i < processes.length;
        i++
    ) {

        const process =
            processes[i];


        if (!process.pid) {

            return {
                valid: false,
                message:
                    `Process ${i + 1} must have a process ID.`
            };

        }


        if (
            pidSet.has(
                process.pid
            )
        ) {

            return {
                valid: false,
                message:
                    `Duplicate process ID "${process.pid}". Please use unique IDs.`
            };

        }


        pidSet.add(
            process.pid
        );


        if (
            !Number.isInteger(
                process.arrivalTime
            ) ||
            process.arrivalTime < 0
        ) {

            return {
                valid: false,
                message:
                    `${process.pid}: arrival time must be 0 or greater.`
            };

        }


        if (
            !Number.isInteger(
                process.burstTime
            ) ||
            process.burstTime <= 0
        ) {

            return {
                valid: false,
                message:
                    `${process.pid}: burst time must be greater than 0.`
            };

        }


        if (
            !Number.isInteger(
                process.priority
            ) ||
            process.priority <= 0
        ) {

            return {
                valid: false,
                message:
                    `${process.pid}: priority must be greater than 0.`
            };

        }

    }


    if (
        algorithmSelect.value === "RR"
    ) {

        const quantum =
            Number(
                quantumInput.value
            );


        if (
            !Number.isInteger(quantum) ||
            quantum <= 0
        ) {

            return {
                valid: false,
                message:
                    "Round Robin time quantum must be a positive whole number."
            };

        }

    }


    return {
        valid: true,
        message: ""
    };

}


/* ============================================================
   CLONE PROCESSES
   ============================================================ */

function cloneProcesses(input) {

    return input.map(
        process => ({
            ...process
        })
    );

}


/* ============================================================
   GANTT SEGMENT HELPER
   ============================================================ */

function addSegment(
    segments,
    pid,
    start,
    end
) {

    if (end <= start) {

        return;

    }


    const last =
        segments[
            segments.length - 1
        ];


    if (
        last &&
        last.pid === pid &&
        last.end === start
    ) {

        last.end = end;

    }
    else {

        segments.push({

            pid,
            start,
            end

        });

    }

}


/* ============================================================
   FCFS
   ============================================================ */

function FCFS(input) {

    const list =
        cloneProcesses(input).sort(
            (a, b) => {

                if (
                    a.arrivalTime !==
                    b.arrivalTime
                ) {

                    return (
                        a.arrivalTime -
                        b.arrivalTime
                    );

                }


                return (
                    a.inputOrder -
                    b.inputOrder
                );

            }
        );


    const segments = [];

    let currentTime = 0;


    list.forEach(
        process => {

            if (
                currentTime <
                process.arrivalTime
            ) {

                addSegment(
                    segments,
                    "IDLE",
                    currentTime,
                    process.arrivalTime
                );

                currentTime =
                    process.arrivalTime;

            }


            const start =
                currentTime;


            const end =
                start +
                process.burstTime;


            addSegment(
                segments,
                process.pid,
                start,
                end
            );


            process.firstStart =
                start;

            process.completionTime =
                end;

            process.remainingTime =
                0;


            currentTime =
                end;

        }
    );


    return {

        processes: list,

        segments

    };

}


/* ============================================================
   SJF — NON PREEMPTIVE
   ============================================================ */

function SJF(input) {

    const list =
        cloneProcesses(input);


    const completed =
        new Set();


    const segments = [];

    const result = [];

    let currentTime = 0;


    while (
        completed.size <
        list.length
    ) {

        const available =
            list.filter(
                process =>
                    !completed.has(
                        process.pid
                    ) &&
                    process.arrivalTime <=
                        currentTime
            );


        if (
            available.length === 0
        ) {

            const future =
                list
                    .filter(
                        process =>
                            !completed.has(
                                process.pid
                            )
                    )
                    .sort(
                        (a, b) =>
                            a.arrivalTime -
                            b.arrivalTime
                    )[0];


            addSegment(
                segments,
                "IDLE",
                currentTime,
                future.arrivalTime
            );


            currentTime =
                future.arrivalTime;


            continue;

        }


        available.sort(
            (a, b) => {

                if (
                    a.burstTime !==
                    b.burstTime
                ) {

                    return (
                        a.burstTime -
                        b.burstTime
                    );

                }


                if (
                    a.arrivalTime !==
                    b.arrivalTime
                ) {

                    return (
                        a.arrivalTime -
                        b.arrivalTime
                    );

                }


                return (
                    a.inputOrder -
                    b.inputOrder
                );

            }
        );


        const process =
            available[0];


        const start =
            currentTime;


        const end =
            start +
            process.burstTime;


        addSegment(
            segments,
            process.pid,
            start,
            end
        );


        process.firstStart =
            start;

        process.completionTime =
            end;

        process.remainingTime =
            0;


        currentTime =
            end;


        completed.add(
            process.pid
        );


        result.push(
            process
        );

    }


    return {

        processes: result,

        segments

    };

}


/* ============================================================
   SRTF — PREEMPTIVE
   ============================================================ */

function SRTF(input) {

    const list =
        cloneProcesses(input);


    list.forEach(
        process => {

            process.remainingTime =
                process.burstTime;

            process.firstStart =
                null;

            process.completionTime =
                null;

        }
    );


    const segments = [];

    let completed = 0;

    let currentTime = 0;


    while (
        completed <
        list.length
    ) {

        const available =
            list.filter(
                process =>
                    process.arrivalTime <=
                        currentTime &&
                    process.remainingTime > 0
            );


        if (
            available.length === 0
        ) {

            const futureProcesses =
                list.filter(
                    process =>
                        process.remainingTime >
                            0 &&
                        process.arrivalTime >
                            currentTime
                );


            if (
                futureProcesses.length === 0
            ) {

                break;

            }


            const nextArrival =
                Math.min(
                    ...futureProcesses.map(
                        process =>
                            process.arrivalTime
                    )
                );


            addSegment(
                segments,
                "IDLE",
                currentTime,
                nextArrival
            );


            currentTime =
                nextArrival;


            continue;

        }


        available.sort(
            (a, b) => {

                if (
                    a.remainingTime !==
                    b.remainingTime
                ) {

                    return (
                        a.remainingTime -
                        b.remainingTime
                    );

                }


                if (
                    a.arrivalTime !==
                    b.arrivalTime
                ) {

                    return (
                        a.arrivalTime -
                        b.arrivalTime
                    );

                }


                return (
                    a.inputOrder -
                    b.inputOrder
                );

            }
        );


        const process =
            available[0];


        if (
            process.firstStart ===
            null
        ) {

            process.firstStart =
                currentTime;

        }


        const nextTime =
            currentTime + 1;


        addSegment(
            segments,
            process.pid,
            currentTime,
            nextTime
        );


        process.remainingTime--;


        currentTime =
            nextTime;


        if (
            process.remainingTime ===
            0
        ) {

            process.completionTime =
                currentTime;

            completed++;

        }

    }


    return {

        processes: list,

        segments

    };

}


/* ============================================================
   ROUND ROBIN
   ============================================================ */

function RoundRobin(
    input,
    quantum
) {

    const list =
        cloneProcesses(input).sort(
            (a, b) => {

                if (
                    a.arrivalTime !==
                    b.arrivalTime
                ) {

                    return (
                        a.arrivalTime -
                        b.arrivalTime
                    );

                }


                return (
                    a.inputOrder -
                    b.inputOrder
                );

            }
        );


    list.forEach(
        process => {

            process.remainingTime =
                process.burstTime;

            process.firstStart =
                null;

            process.completionTime =
                null;

        }
    );


    const segments = [];

    const queue = [];

    let currentTime = 0;

    let nextIndex = 0;

    let completed = 0;


    while (
        completed <
        list.length
    ) {

        /*
         * If queue is empty, move time to the next
         * process arrival.
         */

        if (
            queue.length === 0 &&
            nextIndex < list.length &&
            currentTime <
                list[nextIndex].arrivalTime
        ) {

            const idleStart =
                currentTime;

            const idleEnd =
                list[nextIndex].arrivalTime;


            addSegment(
                segments,
                "IDLE",
                idleStart,
                idleEnd
            );


            currentTime =
                idleEnd;

        }


        /*
         * Add all processes that have arrived.
         */

        while (
            nextIndex < list.length &&
            list[nextIndex].arrivalTime <=
                currentTime
        ) {

            queue.push(
                list[nextIndex]
            );

            nextIndex++;

        }


        if (
            queue.length === 0
        ) {

            continue;

        }


        const process =
            queue.shift();


        if (
            process.firstStart ===
            null
        ) {

            process.firstStart =
                currentTime;

        }


        const executionTime =
            Math.min(
                quantum,
                process.remainingTime
            );


        const start =
            currentTime;


        const end =
            currentTime +
            executionTime;


        addSegment(
            segments,
            process.pid,
            start,
            end
        );


        currentTime =
            end;


        process.remainingTime -=
            executionTime;


        /*
         * Add processes that arrived while this
         * process was running.
         */

        while (
            nextIndex < list.length &&
            list[nextIndex].arrivalTime <=
                currentTime
        ) {

            queue.push(
                list[nextIndex]
            );

            nextIndex++;

        }


        if (
            process.remainingTime >
            0
        ) {

            queue.push(
                process
            );

        }
        else {

            process.completionTime =
                currentTime;

            completed++;

        }

    }


    return {

        processes: list,

        segments

    };

}


/* ============================================================
   PRIORITY SCHEDULING — NON PREEMPTIVE
   ============================================================ */

function PriorityScheduling(input) {

    const list =
        cloneProcesses(input);


    const completed =
        new Set();


    const segments = [];

    const result = [];

    let currentTime = 0;


    while (
        completed.size <
        list.length
    ) {

        const available =
            list.filter(
                process =>
                    !completed.has(
                        process.pid
                    ) &&
                    process.arrivalTime <=
                        currentTime
            );


        if (
            available.length === 0
        ) {

            const future =
                list
                    .filter(
                        process =>
                            !completed.has(
                                process.pid
                            )
                    )
                    .sort(
                        (a, b) => {

                            if (
                                a.arrivalTime !==
                                b.arrivalTime
                            ) {

                                return (
                                    a.arrivalTime -
                                    b.arrivalTime
                                );

                            }


                            return (
                                a.inputOrder -
                                b.inputOrder
                            );

                        }
                    )[0];


            addSegment(
                segments,
                "IDLE",
                currentTime,
                future.arrivalTime
            );


            currentTime =
                future.arrivalTime;


            continue;

        }


        available.sort(
            (a, b) => {

                /*
                 * Smaller priority number =
                 * higher priority.
                 */

                if (
                    a.priority !==
                    b.priority
                ) {

                    return (
                        a.priority -
                        b.priority
                    );

                }


                if (
                    a.arrivalTime !==
                    b.arrivalTime
                ) {

                    return (
                        a.arrivalTime -
                        b.arrivalTime
                    );

                }


                return (
                    a.inputOrder -
                    b.inputOrder
                );

            }
        );


        const process =
            available[0];


        const start =
            currentTime;


        const end =
            start +
            process.burstTime;


        addSegment(
            segments,
            process.pid,
            start,
            end
        );


        process.firstStart =
            start;

        process.completionTime =
            end;

        process.remainingTime =
            0;


        currentTime =
            end;


        completed.add(
            process.pid
        );


        result.push(
            process
        );

    }


    return {

        processes: result,

        segments

    };

}


/* ============================================================
   METRIC CALCULATION
   ============================================================ */

function calculateMetrics(
    resultProcesses,
    segments
) {

    const metrics =
        resultProcesses.map(
            process => {

                const completionTime =
                    process.completionTime;


                const turnaroundTime =
                    completionTime -
                    process.arrivalTime;


                const waitingTime =
                    turnaroundTime -
                    process.burstTime;


                const responseTime =
                    process.firstStart -
                    process.arrivalTime;


                return {

                    pid: process.pid,

                    arrivalTime:
                        process.arrivalTime,

                    burstTime:
                        process.burstTime,

                    priority:
                        process.priority,

                    completionTime,

                    turnaroundTime,

                    waitingTime,

                    responseTime

                };

            }
        );


    const totalWaiting =
        metrics.reduce(
            (sum, process) =>
                sum +
                process.waitingTime,
            0
        );


    const totalTurnaround =
        metrics.reduce(
            (sum, process) =>
                sum +
                process.turnaroundTime,
            0
        );


    const totalResponse =
        metrics.reduce(
            (sum, process) =>
                sum +
                process.responseTime,
            0
        );


    const count =
        metrics.length;


    const averageWaiting =
        totalWaiting / count;


    const averageTurnaround =
        totalTurnaround / count;


    const averageResponse =
        totalResponse / count;


    /*
     * Calculate CPU utilization.
     *
     * Total CPU execution time =
     * sum of all burst times.
     *
     * Total elapsed time =
     * last Gantt ending time.
     */

    const totalBurstTime =
        resultProcesses.reduce(
            (sum, process) =>
                sum +
                process.burstTime,
            0
        );


    const totalElapsedTime =
        segments.length > 0
            ? segments[
                segments.length - 1
            ].end
            : 0;


    const cpuUtilization =
        totalElapsedTime > 0
            ? (
                totalBurstTime /
                totalElapsedTime
            ) * 100
            : 0;


    return {

        metrics,

        averages: {

            waiting:
                averageWaiting,

            turnaround:
                averageTurnaround,

            response:
                averageResponse

        },

        cpuUtilization

    };

}


/* ============================================================
   RUN SELECTED ALGORITHM
   ============================================================ */

function executeAlgorithm(
    algorithm,
    inputProcesses
) {

    switch (algorithm) {

        case "FCFS":

            return FCFS(
                inputProcesses
            );


        case "SJF":

            return SJF(
                inputProcesses
            );


        case "SRTF":

            return SRTF(
                inputProcesses
            );


        case "RR":

            return RoundRobin(
                inputProcesses,
                Number(
                    quantumInput.value
                )
            );


        case "PRIORITY":

            return PriorityScheduling(
                inputProcesses
            );


        default:

            return FCFS(
                inputProcesses
            );

    }

}


/* ============================================================
   MAIN SIMULATION
   ============================================================ */

function runSimulation() {

    const validation =
        validateProcesses();


    if (!validation.valid) {

        showMessage(
            validation.message,
            "error"
        );

        return;

    }


    const algorithm =
        algorithmSelect.value;


    const input =
        cloneProcesses(
            processes
        );


    const result =
        executeAlgorithm(
            algorithm,
            input
        );


    const metricData =
        calculateMetrics(
            result.processes,
            result.segments
        );


    simulationResult = {

        algorithm,

        processes:
            result.processes,

        segments:
            result.segments,

        metrics:
            metricData.metrics,

        averages:
            metricData.averages,

        cpuUtilization:
            metricData.cpuUtilization

    };


    renderGantt(
        result.segments
    );


    renderMetrics(
        metricData
    );


    updateDashboard();


    showMessage(
        `${getAlgorithmShortName(algorithm)} simulation completed successfully.`,
        "success"
    );


    /*
     * Automatically move the page toward
     * the Gantt chart after simulation.
     */

    document
        .getElementById("gantt")
        .scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

}


/* ============================================================
   GANTT CHART RENDERING
   ============================================================ */

function renderGantt(
    segments
) {

    if (
        !segments ||
        segments.length === 0
    ) {

        ganttContainer.innerHTML = `

            <div class="gantt-placeholder">
                No execution data available.
            </div>

        `;

        return;

    }


    const totalTime =
        segments[
            segments.length - 1
        ].end;


    /*
     * Prevent extremely tiny widths.
     */

    const minWidth =
        Math.max(
            500,
            totalTime * 65
        );


    let segmentsHTML = "";


    segments.forEach(
        segment => {

            const duration =
                segment.end -
                segment.start;


            const widthPercent =
                (
                    duration /
                    totalTime
                ) * 100;


            const isIdle =
                segment.pid === "IDLE";


            segmentsHTML += `

                <div
                    class="
                        gantt-segment
                        ${isIdle
                            ? "idle-segment"
                            : "process-segment"}
                    "
                    style="
                        width: ${widthPercent}%;
                    "
                    title="
                        ${escapeHTML(segment.pid)}
                        : ${segment.start} - ${segment.end}
                    "
                >

                    <span class="gantt-label">
                        ${escapeHTML(segment.pid)}
                    </span>

                </div>

            `;

        }
    );


    /*
     * Time labels.
     */

    const boundaries = [];

    segments.forEach(
        segment => {

            if (
                !boundaries.includes(
                    segment.start
                )
            ) {

                boundaries.push(
                    segment.start
                );

            }


            if (
                !boundaries.includes(
                    segment.end
                )
            ) {

                boundaries.push(
                    segment.end
                );

            }

        }
    );


    boundaries.sort(
        (a, b) => a - b
    );


    let timesHTML = "";


    boundaries.forEach(
        time => {

            const position =
                totalTime > 0
                    ? (
                        time /
                        totalTime
                    ) * 100
                    : 0;


            timesHTML += `

                <span
                    class="gantt-time"
                    style="
                        position: absolute;
                        left: ${position}%;
                    "
                >
                    ${time}
                </span>

            `;

        }
    );


    ganttContainer.innerHTML = `

        <div
            class="gantt-wrapper"
            style="min-width: ${minWidth}px;"
        >

            <div class="gantt-title">
                Execution Timeline
            </div>


            <div
                class="gantt-row"
                style="position: relative;"
            >

                ${segmentsHTML}

            </div>


            <div
                class="gantt-times"
                style="position: relative;"
            >

                ${timesHTML}

            </div>

        </div>

    `;

}


/* ============================================================
   METRICS RENDERING
   ============================================================ */

function renderMetrics(
    metricData
) {

    metricsTableBody.innerHTML = "";


    metricData.metrics.forEach(
        metric => {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>

                    <span class="pid-badge">
                        ${escapeHTML(metric.pid)}
                    </span>

                </td>


                <td>
                    ${metric.arrivalTime}
                </td>


                <td>
                    ${metric.burstTime}
                </td>


                <td>
                    ${metric.completionTime}
                </td>


                <td>
                    ${metric.turnaroundTime}
                </td>


                <td>
                    ${metric.waitingTime}
                </td>


                <td>
                    ${metric.responseTime}
                </td>

            `;


            metricsTableBody.appendChild(
                row
            );

        }
    );


    avgWaitingMetric.textContent =
        formatNumber(
            metricData.averages.waiting
        );


    avgTurnaroundMetric.textContent =
        formatNumber(
            metricData.averages.turnaround
        );


    avgResponseMetric.textContent =
        formatNumber(
            metricData.averages.response
        );


    cpuUtilizationMetric.textContent =
        `${formatNumber(
            metricData.cpuUtilization
        )}%`;

}


/* ============================================================
   COMPARE ALL ALGORITHMS
   ============================================================ */

function compareAlgorithms() {

    const validation =
        validateProcesses();


    if (!validation.valid) {

        showMessage(
            validation.message,
            "error"
        );

        return;

    }


    const algorithms = [

        "FCFS",
        "SJF",
        "SRTF",
        "RR",
        "PRIORITY"

    ];


    const comparisonResults = [];


    algorithms.forEach(
        algorithm => {

            let result;


            if (algorithm === "RR") {

                const quantum =
                    Number(
                        quantumInput.value
                    );


                result =
                    RoundRobin(
                        cloneProcesses(processes),
                        quantum
                    );

            }
            else {

                result =
                    executeAlgorithm(
                        algorithm,
                        cloneProcesses(processes)
                    );

            }


            const metricData =
                calculateMetrics(
                    result.processes,
                    result.segments
                );


            comparisonResults.push({

                algorithm,

                waiting:
                    metricData.averages.waiting,

                turnaround:
                    metricData.averages.turnaround,

                response:
                    metricData.averages.response

            });

        }
    );


    renderComparison(
        comparisonResults
    );


    showMessage(
        "All five scheduling algorithms have been compared.",
        "success"
    );


    document
        .getElementById("comparison")
        .scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

}


/* ============================================================
   COMPARISON RENDERING
   ============================================================ */

function renderComparison(results) {

    comparisonTableBody.innerHTML = "";

    const selectedAlgorithm = algorithmSelect.value;

    results.forEach(result => {

        const row = document.createElement("tr");

        // Highlight the currently selected algorithm
        if (result.algorithm === selectedAlgorithm) {
            row.classList.add("selected-algorithm");
        }

        row.innerHTML = `
            <td>
                <span class="algorithm-name">
                    ${escapeHTML(
                        getAlgorithmShortName(
                            result.algorithm
                        )
                    )}

                    ${
                        result.algorithm === selectedAlgorithm
                            ? '<span class="selected-badge">SELECTED</span>'
                            : ''
                    }
                </span>
            </td>

            <td>
                <span class="number-value">
                    ${formatNumber(result.waiting)}
                </span>
            </td>

            <td>
                <span class="number-value">
                    ${formatNumber(result.turnaround)}
                </span>
            </td>

            <td>
                <span class="number-value">
                    ${formatNumber(result.response)}
                </span>
            </td>
        `;

        comparisonTableBody.appendChild(row);

    });

}


/* ============================================================
   CLEAR SIMULATION OUTPUT
   ============================================================ */

function clearSimulationOutput() {

    simulationResult = null;


    ganttContainer.innerHTML = `

        <div class="gantt-placeholder">
            Run a simulation to display the Gantt chart.
        </div>

    `;


    metricsTableBody.innerHTML = `

        <tr>

            <td
                colspan="7"
                class="table-empty"
            >
                Run a simulation to view metrics.
            </td>

        </tr>

    `;


    comparisonTableBody.innerHTML = `

        <tr>

            <td
                colspan="4"
                class="table-empty"
            >
                Click "Compare Algorithms" to compare
                all scheduling methods.
            </td>

        </tr>

    `;


    avgWaitingMetric.textContent =
        "—";


    avgTurnaroundMetric.textContent =
        "—";


    avgResponseMetric.textContent =
        "—";


    cpuUtilizationMetric.textContent =
        "—";


    avgWaitingStat.textContent =
        "—";


    avgResponseStat.textContent =
        "—";

}


/* ============================================================
   EVENT LISTENERS
   ============================================================ */


/*
 * Add Process
 */

addProcessBtn.addEventListener(
    "click",
    function() {

        addProcess();

        showMessage(
            "New process added.",
            "success"
        );

    }
);


/*
 * Load Sample
 */

loadSampleBtn.addEventListener(
    "click",
    loadSample
);


/*
 * Clear All
 */

clearAllBtn.addEventListener(
    "click",
    clearAll
);


/*
 * Run Simulation
 */

runSimulationBtn.addEventListener(
    "click",
    runSimulation
);


/*
 * Compare Algorithms
 */

compareBtn.addEventListener(
    "click",
    compareAlgorithms
);


/*
 * Algorithm selection.
 */

algorithmSelect.addEventListener(
    "change",
    function() {

        updateAlgorithmUI();

        updateDashboard();

        clearSimulationOutput();

        showMessage(
            `${getAlgorithmShortName(
                algorithmSelect.value
            )} selected.`
        );

    }
);


/*
 * Quantum change.
 */

quantumInput.addEventListener(
    "change",
    function() {

        if (
            Number(quantumInput.value) < 1
        ) {

            quantumInput.value = 1;

        }


        clearSimulationOutput();

    }
);


/* ============================================================
   SIDEBAR NAVIGATION
   ============================================================ */

const navItems =
    document.querySelectorAll(
        ".nav-item"
    );


navItems.forEach(
    item => {

        item.addEventListener(
            "click",
            function() {

                navItems.forEach(
                    nav =>
                        nav.classList.remove(
                            "active"
                        )
                );


                this.classList.add(
                    "active"
                );

            }
        );

    }
);


/* ============================================================
   UPDATE ACTIVE SIDEBAR ITEM WHILE SCROLLING
   ============================================================ */

const sections = [

    {
        id: "dashboard",
        nav: 0
    },

    {
        id: "processes",
        nav: 1
    },

    {
        id: "gantt",
        nav: 2
    },

    {
        id: "metrics",
        nav: 3
    },

    {
        id: "comparison",
        nav: 4
    }

];


window.addEventListener(
    "scroll",
    function() {

        const scrollPosition =
            window.scrollY + 180;


        let currentSection =
            sections[0];


        sections.forEach(
            section => {

                const element =
                    document.getElementById(
                        section.id
                    );


                if (
                    element &&
                    element.offsetTop <=
                        scrollPosition
                ) {

                    currentSection =
                        section;

                }

            }
        );


        navItems.forEach(
            item =>
                item.classList.remove(
                    "active"
                )
        );


        if (
            navItems[
                currentSection.nav
            ]
        ) {

            navItems[
                currentSection.nav
            ].classList.add(
                "active"
            );

        }

    }
);


/* ============================================================
   KEYBOARD SHORTCUT
   ============================================================ */

document.addEventListener(
    "keydown",
    function(event) {

        /*
         * Ctrl + Enter
         * Run simulation.
         */

        if (
            event.ctrlKey &&
            event.key === "Enter"
        ) {

            event.preventDefault();

            runSimulation();

        }

    }
);


/* ============================================================
   INITIALIZATION
   ============================================================ */

function initializeApplication() {

    /*
     * Load the sample data automatically.
     *
     * This prevents the dashboard from showing
     * 0 processes when the application first opens.
     */

    loadSample();


    /*
     * Set default algorithm.
     */

    algorithmSelect.value =
        "FCFS";


    /*
     * Hide Round Robin quantum for FCFS.
     */

    quantumGroup.style.display =
        "none";


    /*
     * Update algorithm information.
     */

    updateAlgorithmUI();


    /*
     * Update dashboard.
     */

    updateDashboard();


    /*
     * Make sure simulation output is clean.
     */

    clearSimulationOutput();


    showMessage(
        "Sample processes loaded. Select an algorithm and click Run Simulation.",
        "info"
    );

}


/* ============================================================
   START APPLICATION
   ============================================================ */

document.addEventListener(
    "DOMContentLoaded",
    initializeApplication
);