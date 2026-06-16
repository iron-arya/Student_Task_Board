/* app.js
   This is the main JavaScript file.
   It keeps the main data, listens to button/form actions, and calls other files.
*/

let data = loadData();
let currentMode = loadMode();

document.addEventListener("DOMContentLoaded", startApp);

function startApp() {
    showMode(currentMode);
    showBoard();
    addDropToColumns();

    document.querySelector("#taskForm").addEventListener("submit", formSubmitted);
    document.querySelector("#cancelEditButton").addEventListener("click", clearForm);
    document.querySelector("#searchInput").addEventListener("input", showBoard);
    document.querySelector("#modeButton").addEventListener("click", changeMode);

    document.querySelector(".task-board").addEventListener("click", boardClicked);
}

function formSubmitted(event) {
    event.preventDefault();

    const taskId = document.querySelector("#taskId").value;
    const titleInput = document.querySelector("#taskTitle");
    const title = titleInput.value.trim();

    if (!title) {
        document.querySelector("#titleError").textContent = "Task title is required.";
        titleInput.focus();
        return;
    }

    document.querySelector("#titleError").textContent = "";

    const taskDetails = {
        title,
        description: document.querySelector("#taskDescription").value.trim(),
        priority: document.querySelector("#taskPriority").value,
        dueDate: document.querySelector("#taskDueDate").value
    };

    if (taskId) {
        editTask(taskId, taskDetails);
    } else {
        addTask(taskDetails);
    }

    saveAndShow();
    clearForm();
}

function addTask(taskDetails) {
    const newTask = {
        id: makeId(),
        ...taskDetails,
        status: "todo"
    };

    data.todo.push(newTask);
}

function editTask(taskId, taskDetails) {
    const answer = findTask(taskId);

    if (!answer) {
        return;
    }

    Object.assign(answer.task, taskDetails);
}

function boardClicked(event) {
    const button = event.target.closest("button[data-action]");

    if (!button) {
        return;
    }

    const taskId = button.dataset.taskId;
    const action = button.dataset.action;

    if (action === "edit") {
        const answer = findTask(taskId);

        if (answer) {
            putTaskInForm(answer.task);
        }
    }

    if (action === "delete") {
        deleteTask(taskId);
    }
}

function deleteTask(taskId) {
    const answer = findTask(taskId);

    if (!answer) {
        return;
    }

    const confirmed = confirm(`Delete "${answer.task.title}"?`);

    if (!confirmed) {
        return;
    }

    data[answer.status] = data[answer.status].filter((task) => task.id !== taskId);
    saveAndShow();
    clearForm();
}

function moveTask(taskId, newPlace) {
    const answer = findTask(taskId);

    if (!answer || answer.status === newPlace) {
        return;
    }

    data[answer.status] = data[answer.status].filter((task) => task.id !== taskId);
    answer.task.status = newPlace;
    data[newPlace].push(answer.task);
    saveAndShow();
}

function findTask(taskId) {
    for (const status of Object.keys(data)) {
        const task = data[status].find((item) => item.id === taskId);

        if (task) {
            return { task, status };
        }
    }

    return null;
}

function saveAndShow() {
    saveData(data);
    showBoard();
}

function changeMode() {
    currentMode = currentMode === "dark" ? "light" : "dark";
    saveMode(currentMode);
    showMode(currentMode);
}

function makeId() {
    return `task-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
