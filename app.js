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

  const stats = [
    { label: "Total", value: counts.total },
    { label: "To Do", value: counts.todo },
    { label: "In Progress", value: counts.progress },
    { label: "Done", value: counts.done },
  ];

  statsNode.replaceChildren(
    ...stats.map((stat) => {
      const card = document.createElement("article");
      card.className = "stat-card";
      const label = document.createElement("span");
      label.textContent = stat.label;
      const value = document.createElement("strong");
      value.textContent = String(stat.value);
      card.append(label, value);
      return card;
    })
  );
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

  taskListNode.replaceChildren(
    ...filteredTasks.map((task) => {
      const priorityClass = `task--${task.priority.toLowerCase()}`;
      const taskNode = document.createElement("li");
      taskNode.className = `task ${priorityClass}`;

      const details = document.createElement("div");
      const title = document.createElement("strong");
      title.textContent = String(task.title ?? "");
      const description = document.createElement("p");
      description.textContent = String(task.description ?? "") || "No description";
      details.append(title, description);

      const meta = document.createElement("div");
      meta.className = "task__meta";
      const priorityBadge = document.createElement("span");
      priorityBadge.className = "badge";
      priorityBadge.textContent = task.priority;
      const statusBadge = document.createElement("span");
      statusBadge.className = task.status === "Done" ? "badge badge--done" : "badge";
      statusBadge.textContent = task.status;
      const dueBadge = document.createElement("span");
      dueBadge.className = "badge";
      dueBadge.textContent = `Due: ${formatDueDate(task.dueDate)}`;
      meta.append(priorityBadge, statusBadge, dueBadge);

      const actions = document.createElement("div");
      actions.className = "task__actions";
      const editButton = document.createElement("button");
      editButton.type = "button";
      editButton.dataset.action = "edit";
      editButton.dataset.id = task.id;
      editButton.textContent = "Edit";
      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.className = "delete";
      deleteButton.dataset.action = "delete";
      deleteButton.dataset.id = task.id;
      deleteButton.textContent = "Delete";
      actions.append(editButton, deleteButton);

      taskNode.append(details, meta, actions);
      return taskNode;
    })
  );
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
