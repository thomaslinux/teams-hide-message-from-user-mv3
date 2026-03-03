let styleEl;

function updateCSS(hideUsers, enabled) {
  if (styleEl) styleEl.remove();
  if (!enabled || !hideUsers.length) return;

  const selector = hideUsers
    .map(
      (u) =>
        `div[class*="fui-ChatMessage"]:has(img[src*="${u}"]) div[data-message-content]`,
    )
    .join(",\n");

  styleEl = document.createElement("style");
  styleEl.textContent = `${selector} { display: none !important; }`;
  document.head.appendChild(styleEl);
}

// Load initial state
chrome.runtime.sendMessage(
  { type: "getHideUsers" },
  ({ hideUsers, enabled }) => {
    updateCSS(hideUsers, enabled);
  },
);

// Watch for updates
chrome.storage.onChanged.addListener((changes) => {
  const hideUsers = changes.hideUsers?.newValue;
  const enabled = changes.enabled?.newValue;
  if (hideUsers !== undefined || enabled !== undefined) {
    chrome.storage.sync.get(
      ["hideUsers", "enabled"],
      ({ hideUsers, enabled }) => {
        updateCSS(hideUsers, enabled);
      },
    );
  }
});
