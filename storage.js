/* storage.js
   This file saves and loads the task board data.
   localStorage can save only text, so JSON.stringify() and JSON.parse() are used.
*/

const dataKey = "studentTaskBoardData";
const modeKey = "studentTaskBoardMode";

function blankData() {
    return {
        todo: [],
        inProgress: [],
        done: []
    };
}

function saveData(data) {
    localStorage.setItem(dataKey, JSON.stringify(data));
}

function loadData() {
    const savedData = localStorage.getItem(dataKey);

    if (!savedData) {
        return blankData();
    }

    try {
        const parsedData = JSON.parse(savedData);

        return {
            todo: Array.isArray(parsedData.todo) ? parsedData.todo : [],
            inProgress: Array.isArray(parsedData.inProgress) ? parsedData.inProgress : [],
            done: Array.isArray(parsedData.done) ? parsedData.done : []
        };
    } catch (error) {
        console.error("Data loading problem:", error);
        return blankData();
    }
}

function saveMode(modeName) {
    localStorage.setItem(modeKey, modeName);
}

function loadMode() {
    return localStorage.getItem(modeKey) || "light";
}
