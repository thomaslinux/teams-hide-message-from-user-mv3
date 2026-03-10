// ==UserScript==
// @name        Hide Users Messages cloud.microsoft
// @namespace   Violentmonkey Scripts
// @match       https://teams.cloud.microsoft/*
// @grant       none
// @version     2026.03.03.14.05
// @author      thomaslinux9 && perplexity.ai
// @description 03/03/2026 14:05:00
// @run-at      document-idle
// ==/UserScript==

const hideUsers = ["USER1", "USER2"];

window.addEventListener("load", () => {
  console.log("Hide users:", hideUsers);

  // Build the CSS selector from hideUsers
  const selector = hideUsers
    .map(
      (u) =>
        `div[class*="fui-ChatMessage"]:has(img[src*="${u}"]) div[data-message-content]`,
    )
    .join(",\n");

  const style = document.createElement("style");
  style.textContent = `
    ${selector} {
      display: none !important;
    }
  `;
  document.head.appendChild(style);
});

// javascript select users using name
let users = [];
document
  .querySelectorAll("span[data-tid*=message-author-name]")
  .forEach((span) => {
    if ((span.textContent.includes = "LASTNAME")) {
      users.push(span);
    }
  });

// document.querySelector('div[data-tid="message-pane-list-runway"]').addEventListener('e', () => {
//   console.log('event change on the element');
// })

const usersToHide = ["user1", "user2"];

// Listen for changes on the DOM
const target = document.querySelector(
  'div[data-tid="message-pane-list-runway"]',
);

if (target) {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      document
        .querySelectorAll("span[data-tid*=message-author-name]")
        .forEach((span) => {
          const authorName = span.innerText.trim();

          if (usersToHide.includes(authorName)) {
            // Find the closest chat message container
            const chatMessageDiv = span.closest(
              'div[class*="fui-ChatMessage"]',
            );
            if (chatMessageDiv) {
              // Target the message body inside
              const messageBody = chatMessageDiv.querySelector(
                'div[id*="message-body"] div',
              );
              if (messageBody) {
                messageBody.style.display = "none";
              }
            }
          }
        });
    }
  });

  observer.observe(target, {
    childList: true,
    subtree: true,
    characterData: true,
  });
}
