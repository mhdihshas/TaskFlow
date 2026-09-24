const LS_TASKS_KEY = "tf_tasks_v1";

/* ========= Helpers ========= */
const $ = (id) => document.getElementById(id);

function loadTasks() {
  try {
    return JSON.parse(localStorage.getItem(LS_TASKS_KEY)) || [];
  } catch {
    return [];
  }
}

function saveTasks(tasks) {
  localStorage.setItem(LS_TASKS_KEY, JSON.stringify(tasks));
}

function uid(prefix = "t") {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function normalizeDate(dateStr) {
  // returns YYYY-MM-DD or "" if empty/invalid
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  if (Number.isNaN(d.getTime())) return "";
  return dateStr;
}

function priorityScore(p) {
  if (p === "High") return 3;
  if (p === "Medium") return 2;
  return 1;
}

function isOverdue(task) {
  if (!task.due_date) return false;
  if (task.status === "Done") return false;

  const today = new Date();
  const due = new Date(task.due_date + "T00:00:00");

  today.setHours(0, 0, 0, 0);
  return due < today;
}

function formatStatus(status) {
  if (status === "ToDo") return "To Do";
  if (status === "InProgress") return "In Progress";
  return "Done";
}

/* ========= Elements ========= */
const taskForm = $("taskForm");
const titleInput = $("title");
const descInput = $("description");
const dueDateInput = $("dueDate");
const priorityInput = $("priority");
const statusInput = $("status");
const clearAllBtn = $("clearAllBtn");

const searchInput = $("searchInput");
const filterStatus = $("filterStatus");
const sortBy = $("sortBy");

const taskList = $("taskList");
const emptyMsg = $("emptyMsg");

const statTotal = $("statTotal");
const statDone = $("statDone");
const statOverdue = $("statOverdue");

/* Modal */
const modal = $("modal");
const closeModalBtn = $("closeModalBtn");
const cancelEditBtn = $("cancelEditBtn");
const editForm = $("editForm");
const editId = $("editId");
const editTitle = $("editTitle");
const editDescription = $("editDescription");
const editDueDate = $("editDueDate");
const editPriority = $("editPriority");
const editStatus = $("editStatus");

/* ========= State ========= */
let tasks = loadTasks();

/* ========= CRUD ========= */
function addTask(task) {
  tasks.push(task);
  saveTasks(tasks);
  render();
}

function updateTask(id, patch) {
  tasks = tasks.map((t) =>
    t.id === id ? { ...t, ...patch, updated_at: new Date().toISOString() } : t
  );
  saveTasks(tasks);
  render();
}

function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  saveTasks(tasks);
  render();
}

function clearAllTasks() {
  tasks = [];
  saveTasks(tasks);
  render();
}

/* ========= Filtering/Sorting ========= */
function getVisibleTasks() {
  const q = searchInput.value.trim().toLowerCase();
  const fStatus = filterStatus.value;
  const s = sortBy.value;

  let list = [...tasks];

  if (q) list = list.filter((t) => t.title.toLowerCase().includes(q));
  if (fStatus !== "All") list = list.filter((t) => t.status === fStatus);

  list.sort((a, b) => {
    if (s === "created_desc") return (b.created_at || "").localeCompare(a.created_at || "");
    if (s === "created_asc") return (a.created_at || "").localeCompare(b.created_at || "");

    if (s === "due_asc") return (a.due_date || "9999-12-31").localeCompare(b.due_date || "9999-12-31");
    if (s === "due_desc") return (b.due_date || "0000-01-01").localeCompare(a.due_date || "0000-01-01");

    if (s === "priority_desc") return priorityScore(b.priority) - priorityScore(a.priority);
    if (s === "priority_asc") return priorityScore(a.priority) - priorityScore(b.priority);

    return 0;
  });

  return list;
}

/* ========= Render ========= */
function renderStats() {
  const doneCount = tasks.filter((t) => t.status === "Done").length;
  const overdueCount = tasks.filter(isOverdue).length;

  statTotal.textContent = String(tasks.length);
  statDone.textContent = String(doneCount);
  statOverdue.textContent = String(overdueCount);
}

function badgeText(task) {
  const parts = [];
  parts.push(formatStatus(task.status));
  parts.push(`Priority: ${task.priority}`);
  if (task.due_date) parts.push(isOverdue(task) ? `Due: ${task.due_date} (Overdue)` : `Due: ${task.due_date}`);
  return parts;
}

function renderList() {
  const list = getVisibleTasks();

  taskList.innerHTML = "";
  emptyMsg.classList.toggle("hidden", list.length !== 0);

  for (const t of list) {
    const wrap = document.createElement("div");
    wrap.className = "task";

    const left = document.createElement("div");
    left.className = "taskLeft";

    const titleRow = document.createElement("div");
    titleRow.className = "taskTitleRow";

    const h = document.createElement("p");
    h.className = "taskTitle";
    h.textContent = t.title;

    titleRow.appendChild(h);

    // Badges
    for (const bt of badgeText(t)) {
      const b = document.createElement("span");
      b.className = "badge";
      b.textContent = bt;
      titleRow.appendChild(b);
    }

    const meta = document.createElement("div");
    meta.className = "taskMeta";
    meta.textContent = `Created: ${new Date(t.created_at).toLocaleString()}`;

    const desc = document.createElement("div");
    desc.className = "taskDesc";
    desc.textContent = t.description ? t.description : "No description.";

    left.appendChild(titleRow);
    left.appendChild(meta);
    left.appendChild(desc);

    const right = document.createElement("div");
    right.className = "taskRight";

    const btnDone = document.createElement("button");
    btnDone.className = "smallBtn";
    btnDone.textContent = "Toggle Done";
    btnDone.onclick = () => {
      updateTask(t.id, { status: t.status === "Done" ? "ToDo" : "Done" });
    };

    const btnEdit = document.createElement("button");
    btnEdit.className = "smallBtn";
    btnEdit.textContent = "Edit";
    btnEdit.onclick = () => openEditModal(t);

    const btnDel = document.createElement("button");
    btnDel.className = "smallBtn smallDanger";
    btnDel.textContent = "Delete";
    btnDel.onclick = () => {
      if (confirm("Delete this task?")) deleteTask(t.id);
    };

    right.appendChild(btnDone);
    right.appendChild(btnEdit);
    right.appendChild(btnDel);

    wrap.appendChild(left);
    wrap.appendChild(right);

    taskList.appendChild(wrap);
  }
}

function render() {
  renderStats();
  renderList();
}

/* ========= Modal ========= */
function openEditModal(task) {
  editId.value = task.id;
  editTitle.value = task.title;
  editDescription.value = task.description || "";
  editDueDate.value = task.due_date || "";
  editPriority.value = task.priority || "Medium";
  editStatus.value = task.status || "ToDo";

  modal.classList.remove("hidden");
}

function closeModal() {
  modal.classList.add("hidden");
  editForm.reset();
}

/* ========= Event Listeners ========= */
taskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = titleInput.value.trim();
  if (!title) return;

  const task = {
    id: uid("t"),
    title,
    description: descInput.value.trim(),
    due_date: normalizeDate(dueDateInput.value),
    priority: priorityInput.value,
    status: statusInput.value,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  addTask(task);

  taskForm.reset();
  statusInput.value = "ToDo";
  priorityInput.value = "Medium";
});

clearAllBtn.addEventListener("click", () => {
  if (confirm("Clear ALL tasks? This cannot be undone.")) {
    clearAllTasks();
  }
});

[searchInput, filterStatus, sortBy].forEach((el) => {
  el.addEventListener("input", render);
  el.addEventListener("change", render);
});

closeModalBtn.addEventListener("click", closeModal);
cancelEditBtn.addEventListener("click", closeModal);

modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

editForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const id = editId.value;
  const title = editTitle.value.trim();
  if (!title) return;

  updateTask(id, {
    title,
    description: editDescription.value.trim(),
    due_date: normalizeDate(editDueDate.value),
    priority: editPriority.value,
    status: editStatus.value,
  });

  closeModal();
});

/* ========= Init ========= */
(function init() {
  render();
})();
