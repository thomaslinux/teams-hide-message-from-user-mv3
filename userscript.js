// ==UserScript==
// @name        Hide Users Messages cloud.microsoft
// @namespace   Violentmonkey Scripts
// @match       https://teams.cloud.microsoft/*
// @grant       none
// @version     1.0
// @author      thomaslinux9 && perplexity.ai
// @description 03/03/2026 11:38:20
// @run-at      document-idle
// ==/UserScript==

// add a user familyname in the hideUsers list to hide the user
const hideUsers = ["USER1", "USER2"];

window.addEventListener("load", () => {
  console.log("Hide users:", hideUsers);

  // Build the CSS selector from hideUsers
  const selector = hideUsers
    .map(
      (u) =>
        `div[class*="fui-ChatMessage"]:has(img[src*="${u}"]) div[data-message-content]`,
    )
    .join(",\\n");

  const style = document.createElement("style");
  style.textContent = `
    ${selector} {
      display: none !important;
    }
  `;
  document.head.appendChild(style);
});
