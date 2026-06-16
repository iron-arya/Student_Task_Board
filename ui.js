/* ui.js
   This file shows data on the screen.
   The page is drawn again from the main data object after every change.
*/

const places = [
    { key: "todo", listId: "todoList", countId: "todoCount" },
    { key: "inProgress", listId: "inProgressList", countId: "inProgressCount" },
    { key: "done", listId: "doneList", countId: "doneCount" }
];

function makeCard(task) {
    const card = document.createElement("article");
    card.className = `task-card priority-${task.priority.toLowerCase()}`;
    card.dataset.taskId = task.id;
    card.draggable = true;

    const title = document.createElement("h3");
    title.textContent = task.title;

    const description = document.createElement("p");
    description.textContent = task.description || "No description provided.";

    const meta = document.createElement("div");
    meta.className = "task-meta";

    const priority = document.createElement("span");
    priority.className = `priority-badge ${task.priority.toLowerCase()}`;
    priority.textContent = `${task.priority} Priority`;

    const dueDate = document.createElement("span");
    dueDate.className = "due-date";
    dueDate.textContent = task.dueDate ? `Due: ${formatDate(task.dueDate)}` : "No due date";

    const actions = document.createElement("div");
    actions.className = "card-actions";

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.className = "card-button edit-button";
    editButton.innerHTML = '<i class="bi bi-pencil-square"></i> Edit';
    editButton.dataset.action = "edit";
    editButton.dataset.taskId = task.id;

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "card-button delete-button";
    deleteButton.innerHTML = '<i class="bi bi-trash3"></i> Delete';
    deleteButton.dataset.action = "delete";
    deleteButton.dataset.taskId = task.id;

    meta.append(priority, dueDate);
    actions.append(editButton, deleteButton);
    card.append(title, description, meta, actions);

    addDragToCard(card);
    return card;
}

function showBoard() {
    const searchText = document.querySelector("#searchInput").value.trim().toLowerCase();

    places.forEach((place) => {
        const listBox = document.querySelector(`#${place.listId}`);
        const countBox = document.querySelector(`#${place.countId}`);
        const allTasks = data[place.key];
        const shownTasks = allTasks.filter((task) => task.title.toLowerCase().includes(searchText));

        listBox.innerHTML = "";
        countBox.textContent = allTasks.length;

        if (shownTasks.length === 0) {
            const emptyState = document.createElement("div");
            emptyState.className = "empty-state";
            emptyState.textContent = "No Tasks Yet";
            listBox.appendChild(emptyState);
            return;
        }

        shownTasks.forEach((task) => {
            listBox.appendChild(makeCard(task));
        });
    });
}

function formatDate(dateValue) {
    const date = new Date(`${dateValue}T00:00:00`);
    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}

function clearForm() {
    document.querySelector("#taskForm").reset();
    document.querySelector("#taskId").value = "";
    document.querySelector("#taskPriority").value = "Medium";
    document.querySelector("#formTitle").textContent = "Add New Task";
    document.querySelector("#submitButton").innerHTML = '<i class="bi bi-plus-circle"></i> Add Task';
    document.querySelector("#cancelEditButton").classList.add("hidden");
    document.querySelector("#titleError").textContent = "";
}

function putTaskInForm(task) {
    document.querySelector("#taskId").value = task.id;
    document.querySelector("#taskTitle").value = task.title;
    document.querySelector("#taskDescription").value = task.description;
    document.querySelector("#taskPriority").value = task.priority;
    document.querySelector("#taskDueDate").value = task.dueDate;
    document.querySelector("#formTitle").textContent = "Edit Task";
    document.querySelector("#submitButton").innerHTML = '<i class="bi bi-save"></i> Update Task';
    document.querySelector("#cancelEditButton").classList.remove("hidden");
    document.querySelector("#taskTitle").focus();
}

function showMode(modeName) {
    const body = document.body;
    const modeButton = document.querySelector("#modeButton");

    body.classList.toggle("dark-mode", modeName === "dark");
    body.classList.toggle("light-mode", modeName !== "dark");

    if (modeName === "dark") {
        modeButton.innerHTML = '<i class="bi bi-sun"></i><span>Light Mode</span>';
    } else {
        modeButton.innerHTML = '<i class="bi bi-moon-stars"></i><span>Dark Mode</span>';
    }
}
