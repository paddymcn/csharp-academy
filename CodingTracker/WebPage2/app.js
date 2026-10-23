// app.js: the page's behaviour. It plays the same part as the ViewModel in the XAML version.

// ---------- The data (the ViewModel's properties) ----------
const state = {
  periods: [],   // the choices in the drop-down
  selectedPeriod: null,
  newestFirst: false,
  oldestFirst: false,
  sessions: [],   // each row: { start: "", end: "", duration: "", description: "" }
  selectedSession: null,
  weeklyGoalHours: 0,
  goalProgress: 0,
  goalSummary: "",
};

// ---------- The elements the code needs to reach ----------
const periodsSelect = document.getElementById("periodsSelect");
const newestFirstInput = document.getElementById("newestFirstInput");
const oldestFirstInput = document.getElementById("oldestFirstInput");
const sessionsTable = document.getElementById("sessionsTable");
const weeklyGoalHoursInput = document.getElementById("weeklyGoalHoursInput");
const goalProgressBar = document.getElementById("goalProgressBar");
const goalSummaryText = document.getElementById("goalSummaryText");

// Draws a table body: one <tr> per item, and marks the selected one
function fillTable(tableEl, items, cellsOf, selected, onPick) {
  const body = document.getElementById(tableEl.id + "-rows");
  body.replaceChildren(...items.map(item => {
    const tr = document.createElement("tr");
    cellsOf(item).forEach(text => { const td = document.createElement("td"); td.textContent = text; tr.append(td); });
    tr.setAttribute("aria-selected", String(item === selected));
    if (onPick) tr.addEventListener("click", () => onPick(item));
    return tr;
  }));
}

// Fills a drop-down with options and picks the selected one
function fillSelect(selectEl, items, selected) {
  selectEl.replaceChildren(...items.map(text => new Option(text, text)));
  if (selected !== null) selectEl.value = selected;
}

// ---------- Show the data on the page (what {Binding} does for you in XAML) ----------
function render() {
  fillSelect(periodsSelect, state.periods, state.selectedPeriod);
  newestFirstInput.checked = state.newestFirst;
  oldestFirstInput.checked = state.oldestFirst;
  fillTable(sessionsTable, state.sessions, item => [item.start, item.end, item.duration, item.description], state.selectedSession, item => { state.selectedSession = item; render(); });
  weeklyGoalHoursInput.value = state.weeklyGoalHours;
  goalProgressBar.value = state.goalProgress;
  goalSummaryText.textContent = state.goalSummary;
}

// ---------- Button actions (the ViewModel's commands) ----------
function addSession() {
  // TODO: what should happen when "Add session" is clicked?
  render();
}

function deleteSession() {
  // TODO: what should happen when "Delete" is clicked?
  render();
}

// ---------- Connect the page to the code ----------
periodsSelect.addEventListener("change", () => { state.selectedPeriod = periodsSelect.value; render(); });
newestFirstInput.addEventListener("change", () => { document.querySelectorAll('input[name="SortOrder"]').forEach(r => { const key = r.dataset.state; if (key) state[key] = r.checked; }); render(); });
oldestFirstInput.addEventListener("change", () => { document.querySelectorAll('input[name="SortOrder"]').forEach(r => { const key = r.dataset.state; if (key) state[key] = r.checked; }); render(); });
document.getElementById("addSessionButton").addEventListener("click", addSession);
document.getElementById("deleteSessionButton").addEventListener("click", deleteSession);
weeklyGoalHoursInput.addEventListener("input", () => { state.weeklyGoalHours = Number(weeklyGoalHoursInput.value); render(); });

// ---------- Tabs: show the panel for the tab that was clicked ----------
document.querySelectorAll(".tab-list").forEach(list => {
  list.addEventListener("click", e => {
    const tab = e.target.closest('[role="tab"]');
    if (!tab) return;
    list.querySelectorAll('[role="tab"]').forEach(t => {
      const on = t === tab;
      t.setAttribute("aria-selected", String(on));
      document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
    });
  });
});

render();

