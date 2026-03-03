const userInput = document.getElementById("userInput");
const addUserBtn = document.getElementById("addUser");
const userTableBody = document.querySelector("#userTable tbody");
const modeRadios = document.querySelectorAll('input[name="mode"]');

chrome.storage.sync.get(
  ["hideUsers", "hideMode"],
  ({ hideUsers = [], hideMode = "content" }) => {
    renderTable(hideUsers);
    setMode(hideMode);
  },
);

addUserBtn.addEventListener("click", addUser);
userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addUser();
});
modeRadios.forEach((r) => r.addEventListener("change", saveChanges));

function addUser() {
  const name = userInput.value.trim();
  if (!name) return;
  chrome.storage.sync.get(["hideUsers"], ({ hideUsers = [] }) => {
    hideUsers.push({ name, enabled: true });
    saveToStorage(hideUsers);
    userInput.value = "";
  });
}

function toggleUser(name) {
  chrome.storage.sync.get(["hideUsers"], ({ hideUsers = [] }) => {
    const updated = hideUsers.map((u) =>
      u.name === name ? { ...u, enabled: !u.enabled } : u,
    );
    saveToStorage(updated);
  });
}

function removeUser(name) {
  chrome.storage.sync.get(["hideUsers"], ({ hideUsers = [] }) => {
    const updated = hideUsers.filter((u) => u.name !== name);
    saveToStorage(updated);
  });
}

function setMode(mode) {
  document.querySelector(`input[value="${mode}"]`).checked = true;
}

function saveToStorage(hideUsers) {
  const hideMode = document.querySelector('input[name="mode"]:checked').value;
  chrome.storage.sync.set({ hideUsers, hideMode });
  renderTable(hideUsers);
  updateContentScript(hideUsers, hideMode);
}

function renderTable(hideUsers) {
  userTableBody.innerHTML = "";
  hideUsers.forEach(({ name, enabled }) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${name}</td>
      <td><input type="checkbox" ${enabled ? "checked" : ""}></td>
      <td><button class="remove">x</button></td>
    `;

    row
      .querySelector("input")
      .addEventListener("change", () => toggleUser(name));
    row
      .querySelector(".remove")
      .addEventListener("click", () => removeUser(name));

    userTableBody.appendChild(row);
  });
}

function saveChanges() {
  chrome.storage.sync.get(["hideUsers"], ({ hideUsers = [] }) => {
    const hideMode = document.querySelector('input[name="mode"]:checked').value;
    saveToStorage(hideUsers, hideMode);
  });
}

function updateContentScript(hideUsers, hideMode) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]?.id) {
      chrome.tabs.sendMessage(tabs[0].id, {
        type: "updateHideList",
        hideUsers,
        hideMode,
      });
    }
  });
}
