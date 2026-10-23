// app.js — talks to the CodingTracker API and fills in the register table.
// The API lives in Program.cs at /api/sessions.

const API = "/api/sessions";

// Grab the parts of the page we need to read from or write to
const table = document.getElementById("entries");
const totals = document.getElementById("totals");
const statusLine = document.getElementById("status");
const startInput = document.getElementById("start");
const endInput = document.getElementById("end");
const descriptionInput = document.getElementById("description");
const preview = document.getElementById("preview");
const form = document.getElementById("new-session");


// ---------- Small helpers ----------

// The API sends Duration as text like "01:30:00". Turn that into minutes.
// (Sessions over 24 hours would arrive as "1.02:00:00"; we handle that too.)
function durationToMinutes(duration) {
  let days = 0;
  if (duration.includes(".") && duration.indexOf(".") < duration.indexOf(":")) {
    const parts = duration.split(".");
    days = Number(parts[0]);
    duration = parts[1];
  }
  const [hours, minutes] = duration.split(":").map(Number);
  return days * 24 * 60 + hours * 60 + minutes;
}

// 90 -> "1 h 30 m"
function formatMinutes(total) {
  const hours = Math.floor(total / 60);
  const minutes = total % 60;
  if (hours === 0) return minutes + " m";
  if (minutes === 0) return hours + " h";
  return hours + " h " + minutes + " m";
}

// A date -> "Fri 9 Oct, 09:00"
function formatDate(date) {
  return date.toLocaleString("en-GB", {
    weekday: "short", day: "numeric", month: "short",
    hour: "2-digit", minute: "2-digit"
  });
}

// A date -> "2026-10-09T09:00", the format the date picker inputs use
function toInputValue(date) {
  const pad = n => String(n).padStart(2, "0");
  return date.getFullYear() + "-" + pad(date.getMonth() + 1) + "-" + pad(date.getDate()) +
         "T" + pad(date.getHours()) + ":" + pad(date.getMinutes());
}

function showMessage(text, isError) {
  statusLine.textContent = text;
  statusLine.classList.toggle("error", isError === true);
}


// ---------- Showing the sessions ----------

function showSessions(sessions) {
  // Remove the old rows, but keep the first row (the entry line with the inputs)
  while (table.rows.length > 1) {
    table.deleteRow(1);
  }

  if (sessions.length === 0) {
    const row = table.insertRow();
    const cell = row.insertCell();
    cell.colSpan = 5;
    cell.textContent = "No sessions logged yet. Fill in the first line above to log one.";
    row.className = "empty";
    totals.textContent = "Nothing logged yet.";
    return;
  }

  // Work out Monday 00:00 of this week, for the "this week" total
  const today = new Date();
  const daysSinceMonday = (today.getDay() + 6) % 7;
  const monday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - daysSinceMonday);

  let weekMinutes = 0;
  let allMinutes = 0;

  // The API returns oldest first. Reverse it so the newest is at the top.
  for (const session of sessions.slice().reverse()) {
    const started = new Date(session.startTime);
    const finished = new Date(session.endTime);
    const minutes = durationToMinutes(session.duration);

    allMinutes += minutes;
    if (started >= monday) weekMinutes += minutes;

    const row = table.insertRow();
    row.className = "entry-row";

    // textContent (not innerHTML) so a description can never inject HTML into the page
    row.insertCell().textContent = formatDate(started);
    row.insertCell().textContent = formatDate(finished);
    row.insertCell().textContent = formatMinutes(minutes);
    row.insertCell().textContent = session.description || "—";

    const actionCell = row.insertCell();
    actionCell.className = "col-action";
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-button";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => deleteSession(session.id, started));
    actionCell.appendChild(deleteButton);
  }

  totals.textContent = "This week: " + formatMinutes(weekMinutes) +
                       ". All time: " + formatMinutes(allMinutes) + ".";
}


// ---------- Talking to the API ----------

// GET /api/sessions -> your repository's GetAll()
async function loadSessions() {
  try {
    const response = await fetch(API);
    const sessions = await response.json();
    showSessions(sessions);
  } catch {
    totals.textContent = "Sessions unavailable.";
    showMessage("Can't reach the CodingTracker server. Check that dotnet run is still running.", true);
  }
}

// POST /api/sessions -> your repository's Add()
async function addSession(event) {
  event.preventDefault(); // stop the browser reloading the page

  if (startInput.value === "" || endInput.value === "") {
    showMessage("Enter both a start and a finish time.", true);
    return;
  }

  const newSession = {
    description: descriptionInput.value.trim(),
    startTime: startInput.value + ":00",
    endTime: endInput.value + ":00"
  };

  try {
    const response = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newSession)
    });

    if (!response.ok) {
      // The API sends { error: "..." } when the times are wrong
      const problem = await response.json();
      showMessage(problem.error || "The server didn't accept that session.", true);
      return;
    }

    showMessage("Session logged.");
    descriptionInput.value = "";
    loadSessions();
  } catch {
    showMessage("Couldn't log the session. Check that the server is still running.", true);
  }
}

// DELETE /api/sessions/{id} -> your repository's Delete()
async function deleteSession(id, started) {
  if (!confirm("Delete the session started " + formatDate(started) + "?")) return;

  try {
    const response = await fetch(API + "/" + id, { method: "DELETE" });

    if (response.status === 404) {
      showMessage("That session had already been deleted.", true); // Delete() returned false
    } else {
      showMessage("Session deleted.");
    }
    loadSessions();
  } catch {
    showMessage("Couldn't delete the session. Check that the server is still running.", true);
  }
}


// ---------- Live duration preview on the entry line ----------

function updatePreview() {
  if (startInput.value === "" || endInput.value === "") {
    preview.textContent = "–";
    return;
  }
  const minutes = Math.round((new Date(endInput.value) - new Date(startInput.value)) / 60000);
  preview.textContent = minutes > 0 ? formatMinutes(minutes) : "Ends too early";
  preview.classList.toggle("invalid", minutes <= 0);
}


// ---------- Start-up ----------

form.addEventListener("submit", addSession);
startInput.addEventListener("input", updatePreview);
endInput.addEventListener("input", updatePreview);

// Pre-fill the entry line with the last hour
const now = new Date();
now.setSeconds(0, 0);
endInput.value = toInputValue(now);
startInput.value = toInputValue(new Date(now.getTime() - 60 * 60 * 1000));
updatePreview();

loadSessions();
