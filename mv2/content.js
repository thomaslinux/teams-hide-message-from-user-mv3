let hideUsers = [];
let hideMode = "content";
let hideMyMessages = false;

function buildSelector() {
  const base =
    hideMode === "content"
      ? `div[class*="fui-ChatMessage"]:has(img[src*="{{u}}"]) div[data-message-content]`
      : `div[class*="fui-ChatMessage"]:has(img[src*="{{u}}"])`;

  let selectors = hideUsers
    .filter((u) => u.enabled)
    .map((u) => base.replace("{{u}}", u.name));

  if (hideMyMessages) {
    selectors.push(`div[class*="fui-ChatMyMessage"]`);
  }

  return selectors.join(",\n");
}

function applyCSS() {
  let style = document.getElementById("hideUsersStyle");
  if (!style) {
    style = document.createElement("style");
    style.id = "hideUsersStyle";
    document.head.appendChild(style);
  }

  const selector = buildSelector();
  style.textContent = selector
    ? `${selector} { display: none !important; }`
    : "";
}

browser.storage.local
  .get(["hideUsers", "hideMode", "hideMyMessages"])
  .then((res) => {
    hideUsers = res.hideUsers || [];
    hideMode = res.hideMode || "content";
    hideMyMessages = res.hideMyMessages || false;
    applyCSS();
  });

browser.storage.onChanged.addListener((changes) => {
  if (changes.hideUsers) hideUsers = changes.hideUsers.newValue;
  if (changes.hideMode) hideMode = changes.hideMode.newValue;
  if (changes.hideMyMessages) hideMyMessages = changes.hideMyMessages.newValue;
  applyCSS();
});
