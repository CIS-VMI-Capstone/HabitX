const input = document.getElementById("new-task");
const addBtn = document.getElementById("add-btn");
const list = document.getElementById("task-list");
const emptyMsg = document.getElementById("empty-msg");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
    list.innerHTML = "";
    emptyMsg.style.display = tasks.length ? "none" : "block";

    tasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.className = `task ${task.done ? "completed" : ""}`;

        const span = document.createElement("span");
        span.textContent = task.text;
        span.onclick = () => toggleTask(index);

        const btns = document.createElement("div");
        btns.className = "task-buttons";

        const editBtn = document.createElement("button");
        editBtn.textContent = "✏️";
        editBtn.onclick = () => editTask(index);

        const delBtn = document.createElement("button");
        delBtn.textContent = "🗑";
        delBtn.onclick = () => deleteTask(index);

        btns.append(editBtn, delBtn);
        li.append(span, btns);
        list.appendChild(li);
    });
}

function addTask() {
    const text = input.value.trim();
    if (!text) return;

    tasks.push({ text, done: false });
    input.value = "";
    saveTasks();
    renderTasks();
}

function toggleTask(index) {
    tasks[index].done = !tasks[index].done;
    saveTasks();
    renderTasks();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
}

function editTask(index) {
    const newText = prompt("Edit task:", tasks[index].text);
    if (newText !== null && newText.trim() !== "") {
        tasks[index].text = newText.trim();
        saveTasks();
        renderTasks();
    }
}

addBtn.addEventListener("click", addTask);
input.addEventListener("keypress", e => {
    if (e.key === "Enter") addTask();
});

renderTasks();
