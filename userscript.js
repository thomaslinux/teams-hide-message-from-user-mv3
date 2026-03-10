// ==UserScript==
// @name        Hide Users Messages cloud.microsoft
// @namespace   Violentmonkey Scripts
// @match       https://teams.cloud.microsoft/*
// @grant       none
// @version     2026.03.10.14.05
// @author      thomaslinux9 && perplexity.ai
// @description Hide Users Messages cloud.microsoft
// @run-at       document-end
// ==/UserScript==

(function () {
  "use strict";

  let usersToHide = [];

  // Console functions - these WILL work from browser console
  window.hideUser = function (name) {
    if (usersToHide.indexOf(name) === -1) {
      usersToHide.push(name);
      console.log(
        `✅ Hidden user: "${name}". Total hidden: ${usersToHide.length}`,
      );
      applyHiding();
    }
  };

  window.showUser = function (name) {
    const index = usersToHide.indexOf(name);
    if (index > -1) {
      usersToHide.splice(index, 1);
      console.log(
        `✅ Showed user: "${name}". Total hidden: ${usersToHide.length}`,
      );
      applyHiding();
    }
  };

  window.showAllUsers = function () {
    const count = usersToHide.length;
    usersToHide = [];
    console.log(`✅ Showed all ${count} hidden users`);
    applyHiding();
  };

  window.listHiddenUsers = function () {
    console.log("Hidden users:", usersToHide);
  };

  function applyHiding() {
    document
      .querySelectorAll("span[data-tid*=message-author-name]")
      .forEach((span) => {
        const hasUserToHide = usersToHide.some(
          (user) => span.innerText === user,
        );
        if (hasUserToHide) {
          span.classList.add("userToHide");
        } else {
          span.classList.remove("userToHide");
        }
      });
  }

  window.addEventListener("load", () => {
    const target = document.querySelector(
      'div[data-tid="message-pane-list-runway"]',
    );

    if (target) {
      const observer = new MutationObserver(() => {
        applyHiding();
      });

      observer.observe(target, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    }

    // Initial hide + CSS
    applyHiding();

    const style = document.createElement("style");
    style.id = "hideThoseUsers";
    style.textContent = `
      div[class*="fui-ChatMessage"]:has(span.userToHide) {
        display: none !important;
      }
    `;
    document.head.appendChild(style);

    console.log("✅ User Hider Loaded! Use these commands:");
    console.log('hideUser("John DOE")     // Hide a user');
    console.log('showUser("John DOE")     // Show a specific user');
    console.log("showAllUsers()           // Show everyone");
    console.log("listHiddenUsers()        // List hidden users");
  });
})();

// hideUser("John DOE")      // Hide John
// hideUser("Jane Smith")    // Hide Jane
// showUser("John DOE")      // Show John again
// showAllUsers()            // Show everyone
// listHiddenUsers()         // See who's hidden
