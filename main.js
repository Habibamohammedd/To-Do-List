const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const completedCount = document.getElementById("completedCount");
const finishAllBtn = document.getElementById("finishAllBtn");
const deleteAllBtn = document.getElementById("deleteAllBtn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// SweetAlert2 Alert
function showAlert(message, icon = "success") {
  Swal.fire({
    title: message,
    icon: icon,
    confirmButtonText: "OK",
    confirmButtonColor: "#8f54ceff",
    background: "linear-gradient(135deg, #d2bf80ff, #fcb6a3ff)",
    color: "#fff",
  });
}

// Render tasks
function renderTasks() {
  taskList.innerHTML = "";
  tasks.forEach(task => {
    const li = document.createElement("li");
    li.className = "task-item";

    const span = document.createElement("span");
    span.textContent = task.text;
    span.className = "task-text " + (task.completed ? "completed" : "");

    const btnGroup = document.createElement("div");

    // Finish Button
    const finishBtn = document.createElement("button");
    finishBtn.className = "btn btn-sm gradient-btn me-2";
    finishBtn.textContent = task.completed ? "Undo" : "Finish";
    finishBtn.onclick = () => {
      task.completed = !task.completed;
      saveTasks();
      renderTasks();
      updateStats();
      showAlert(task.completed ? "Task Completed " : "Task Active ", "info");
    };

    // Delete Button
    const delBtn = document.createElement("button");
    delBtn.className = "btn btn-sm gradient-danger";
    delBtn.textContent = "Delete";
    delBtn.onclick = () => {
      tasks = tasks.filter(t => t.id !== task.id);
      saveTasks();
      renderTasks();
      updateStats();
      showAlert("Task Deleted ", "error");
    };

    btnGroup.appendChild(finishBtn);
    btnGroup.appendChild(delBtn);
    li.appendChild(span);
    li.appendChild(btnGroup);
    taskList.appendChild(li);
  });

  updateStats();
}

// Update stats
function updateStats() {
  taskCount.textContent = tasks.length;
  completedCount.textContent = tasks.filter(t => t.completed).length;
}

// Add new task
addBtn.onclick = () => {
  const text = taskInput.value.trim();
  if (text) {
    tasks.push({ id: Date.now(), text, completed: false });
    taskInput.value = "";
    saveTasks();
    renderTasks();
    showAlert("Task Added ", "success");
  } else {
    showAlert("Please enter a task ", "warning");
  }
};

// Enter key to add
taskInput.addEventListener("keypress", e => {
  if (e.key === "Enter") addBtn.click();
});

// Finish all
finishAllBtn.onclick = () => {
  tasks.forEach(task => (task.completed = true));
  saveTasks();
  renderTasks();
  showAlert("All tasks completed ", "success");
};

// Delete all
deleteAllBtn.onclick = () => {
  tasks = [];
  saveTasks();
  renderTasks();
  showAlert("All tasks deleted ", "error");
};

// Initial render
renderTasks();
