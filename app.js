const STORAGE_KEY = "taskflow.tasks";

const form = document.getElementById("task-form");
const taskIdInput = document.getElementById("task-id");
const titleInput = document.getElementById("task-title");
const descriptionInput = document.getElementById("task-description");
const priorityInput = document.getElementById("task-priority");
const statusInput = document.getElementById("task-status");
const dueDateInput = document.getElementById("task-due-date");
const searchInput = document.getElementById("search");
const statusFilter = document.getElementById("filter-status");
const priorityFilter = document.getElementById("filter-priority");
const statsNode = document.getElementById("stats");
const taskListNode = document.getElementById("task-list");
const emptyStateNode = document.getElementById("empty-state");
const submitBtn = document.getElementById("submit-btn");
const cancelBtn = document.getElementById("cancel-btn");

let tasks = loadTasks();
let editingTaskId = null;

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function resetForm() {
  form.reset();
  priorityInput.value = "Medium";
  statusInput.value = "To Do";
  taskIdInput.value = "";
  editingTaskId = null;
  submitBtn.textContent = "Add task";
  cancelBtn.hidden = true;
}

function createTaskFromForm() {
  return {
    id: editingTaskId ?? crypto.randomUUID(),
    title: titleInput.value.trim(),
    description: descriptionInput.value.trim(),
    priority: priorityInput.value,
    status: statusInput.value,
    dueDate: dueDateInput.value || "",
    updatedAt: new Date().toISOString(),
  };
}

function getFilteredTasks() {
  const query = searchInput.value.trim().toLowerCase();
  const statusValue = statusFilter.value;
  const priorityValue = priorityFilter.value;

  return tasks.filter((task) => {
    const taskTitle = String(task.title ?? "");
    const taskDescription = String(task.description ?? "");
    const matchesQuery =
      !query ||
      taskTitle.toLowerCase().includes(query) ||
      taskDescription.toLowerCase().includes(query);
    const matchesStatus = statusValue === "All" || task.status === statusValue;
    const matchesPriority = priorityValue === "All" || task.priority === priorityValue;

    return matchesQuery && matchesStatus && matchesPriority;
  });
}

function renderStats() {
  const counts = {
    total: tasks.length,
    todo: tasks.filter((task) => task.status === "To Do").length,
    progress: tasks.filter((task) => task.status === "In Progress").length,
    done: tasks.filter((task) => task.status === "Done").length,
  };

  statsNode.innerHTML = [
    { label: "Total", value: counts.total },
    { label: "To Do", value: counts.todo },
    { label: "In Progress", value: counts.progress },
    { label: "Done", value: counts.done },
  ]
    .map(
      (stat) =>
        `<article class="stat-card"><span>${stat.label}</span><strong>${stat.value}</strong></article>`
    )
    .join("");
}

function formatDueDate(dateString) {
  if (!dateString) return "No due date";
  const parsed = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return "No due date";
  return parsed.toLocaleDateString();
}

function renderTasks() {
  const filteredTasks = getFilteredTasks().sort((a, b) => {
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return a.dueDate.localeCompare(b.dueDate);
  });

  emptyStateNode.hidden = filteredTasks.length > 0;

  taskListNode.innerHTML = filteredTasks
    .map((task) => {
      const priorityClass = `task--${task.priority.toLowerCase()}`;
      const doneBadgeClass = task.status === "Done" ? "badge badge--done" : "badge";

      return `
      <li class="task ${priorityClass}">
        <div>
          <strong>${escapeHtml(task.title)}</strong>
          <p>${escapeHtml(task.description) || "No description"}</p>
        </div>
        <div class="task__meta">
          <span class="badge">${task.priority}</span>
          <span class="${doneBadgeClass}">${task.status}</span>
          <span class="badge">Due: ${formatDueDate(task.dueDate)}</span>
        </div>
        <div class="task__actions">
          <button type="button" data-action="edit" data-id="${task.id}">Edit</button>
          <button type="button" class="delete" data-action="delete" data-id="${task.id}">Delete</button>
        </div>
      </li>`;
    })
    .join("");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function render() {
  renderStats();
  renderTasks();
}

function startEdit(taskId) {
  const task = tasks.find((item) => item.id === taskId);
  if (!task) return;

  editingTaskId = task.id;
  taskIdInput.value = task.id;
  titleInput.value = task.title;
  descriptionInput.value = task.description;
  priorityInput.value = task.priority;
  statusInput.value = task.status;
  dueDateInput.value = task.dueDate;
  submitBtn.textContent = "Update task";
  cancelBtn.hidden = false;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const candidate = createTaskFromForm();
  if (!candidate.title) {
    titleInput.focus();
    return;
  }

  if (editingTaskId) {
    tasks = tasks.map((task) => (task.id === editingTaskId ? candidate : task));
  } else {
    tasks = [candidate, ...tasks];
  }

  saveTasks();
  resetForm();
  render();
});

cancelBtn.addEventListener("click", () => {
  resetForm();
});

taskListNode.addEventListener("click", (event) => {
  const actionButton = event.target.closest("button[data-action]");
  if (!actionButton) return;

  const { action, id } = actionButton.dataset;
  if (!id) return;

  if (action === "delete") {
    tasks = tasks.filter((task) => task.id !== id);
    if (editingTaskId === id) resetForm();
    saveTasks();
    render();
  }

  if (action === "edit") {
    startEdit(id);
  }
});

[searchInput, statusFilter, priorityFilter].forEach((input) => {
  input.addEventListener("input", render);
  input.addEventListener("change", render);
});

render();
