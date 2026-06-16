/* dragdrop.js
   This file is for the HTML5 Drag and Drop API.
   When a card is dragged, we save its id. When it is dropped, we move that task.
*/

let draggedId = null;

function dragStarted(event) {
    draggedId = event.currentTarget.dataset.taskId;
    event.dataTransfer.setData("text/plain", draggedId);
    event.dataTransfer.effectAllowed = "move";
    event.currentTarget.classList.add("dragging");
}

function dragEnded(event) {
    event.currentTarget.classList.remove("dragging");
    draggedId = null;
}

function draggingOverColumn(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    event.currentTarget.classList.add("drag-over");
}

function dragLeftColumn(event) {
    event.currentTarget.classList.remove("drag-over");
}

function taskDropped(event) {
    event.preventDefault();
    const newPlace = event.currentTarget.dataset.status;
    const taskId = event.dataTransfer.getData("text/plain") || draggedId;

    event.currentTarget.classList.remove("drag-over");

    if (taskId && newPlace) {
        moveTask(taskId, newPlace);
    }
}

function addDragToCard(card) {
    card.addEventListener("dragstart", dragStarted);
    card.addEventListener("dragend", dragEnded);
}

function addDropToColumns() {
    document.querySelectorAll(".task-list").forEach((list) => {
        list.addEventListener("dragover", draggingOverColumn);
        list.addEventListener("dragleave", dragLeftColumn);
        list.addEventListener("drop", taskDropped);
    });
}
