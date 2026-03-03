const userListEl = document.getElementById("userList");
const toggleEl = document.getElementById("toggleEnable");
const newUserEl = document.getElementById("newUser");
const addBtn = document.getElementById("addBtn");

function renderList(users) {
  userListEl.innerHTML = "";
  users.forEach((user) => {
    const li = document.createElement("li");

    const chk = document.createElement("input");
    chk.type = "checkbox";
    chk.checked = user.hidden;
    chk.onchange = () => toggleUser(user.name, chk.checked);

    const label = document.createElement("label");
    label.textContent = " " + user.name + " ";

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.onclick = () => removeUser(user.name);

    li.appendChild(chk);
    li.appendChild(label);
    li.appendChild(removeBtn);
    userListEl.appendChild(li);
  });
}

function loadSettings() {
  chrome.storage.sync.get(
    ["hideUsers", "enabled"],
    ({ hideUsers, enabled }) => {
      renderList(hideUsers || []);
      toggleEl.checked = enabled ?? true;
    },
  );
}

function toggleUser(name, hidden) {
  chrome.storage.sync.get("hideUsers", ({ hideUsers }) => {
    const updated = hideUsers.map((u) =>
      u.name === name ? { ...u, hidden } : u,
    );
    chrome.storage.sync.set({ hideUsers: updated });
    renderList(updated);
  });
}

function removeUser(name) {
  chrome.storage.sync.get("hideUsers", ({ hideUsers }) => {
    const updated = hideUsers.filter((u) => u.name !== name);
    chrome.storage.sync.set({ hideUsers: updated });
    renderList(updated);
  });
}

addBtn.onclick = () => {
  const newUser = newUserEl.value.trim();
  if (!newUser) return;
  chrome.storage.sync.get("hideUsers", ({ hideUsers }) => {
    const updated = [...(hideUsers || []), { name: newUser, hidden: true }];
    chrome.storage.sync.set({ hideUsers: updated });
    renderList(updated);
    newUserEl.value = "";
  });
};

toggleEl.onchange = () => {
  chrome.storage.sync.set({ enabled: toggleEl.checked });
};

loadSettings();
