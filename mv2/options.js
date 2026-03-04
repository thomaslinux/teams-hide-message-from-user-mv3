const usernameInput = document.getElementById("username");
const addUserBtn = document.getElementById("addUser");
const usersTable = document.querySelector("#usersTable tbody");
const masterEnable = document.getElementById("masterEnable");

function loadOptions() {
  chrome.storage.sync.get(["hideUsers", "mode", "enabled"], (data) => {
    const { hideUsers = [], mode = "content", enabled = true } = data;
    masterEnable.checked = enabled;
    document.querySelector(`input[name="mode"][value="${mode}"]`).checked =
      true;
    usersTable.innerHTML = "";
    hideUsers.forEach((user) => addUserRow(user));
  });
}

function saveOptions() {
  const users = Array.from(usersTable.querySelectorAll("tr")).map((row) => ({
    name: row.dataset.user,
    hide: row.querySelector("input[type=checkbox]").checked,
  }));

  chrome.storage.sync.set({
    hideUsers: users.filter((u) => u.hide).map((u) => u.name),
    enabled: masterEnable.checked,
    mode: document.querySelector("input[name=mode]:checked").value,
  });
}

function addUserRow(user) {
  const row = document.createElement("tr");
  row.dataset.user = user;
  row.innerHTML = `
    <td>${user}</td>
    <td><input type="checkbox" checked></td>
    <td><button>Remove</button></td>
  `;
  row.querySelector("input").addEventListener("change", saveOptions);
  row.querySelector("button").addEventListener("click", () => {
    row.remove();
    saveOptions();
  });
  usersTable.appendChild(row);
}

addUserBtn.addEventListener("click", () => {
  const username = usernameInput.value.trim();
  if (!username) return;
  addUserRow(username);
  usernameInput.value = "";
  saveOptions();
});

masterEnable.addEventListener("change", saveOptions);
document
  .querySelectorAll("input[name=mode]")
  .forEach((el) => el.addEventListener("change", saveOptions));

window.addEventListener("load", loadOptions);
