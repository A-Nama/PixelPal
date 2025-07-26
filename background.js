// A list of distracting websites. You can add more!
const DISTRACTION_SITES = [
  "twitter.com",
  "facebook.com",
  "instagram.com",
  "youtube.com",
  "reddit.com"
];

// This function creates the right-click "Vibe Check" menu item.
// It runs once, when the extension is first installed.
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "vibeCheck",
    title: "Check the vibe with PixelPal ✨",
    contexts: ["selection"] // This makes it appear only when text is highlighted
  });
});

// This function listens for a click on the menu item we just created.
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "vibeCheck" && info.selectionText) {
    // This is where Teammate B's work will start.
    // For now, we'll just log the selected text to the console.
    console.log("Selected text for vibe check:", info.selectionText);

    // You could also show a simple notification.
    chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon30.png',
        title: 'Vibe Check!',
        message: 'Sending this text to the vibe machine...'
    });
  }
});

// This function listens for updates to any tab.
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // We only care when the URL changes.
  if (changeInfo.url) {
    // Check if the new URL is in our distraction list.
    const isDistraction = DISTRACTION_SITES.some(site => changeInfo.url.includes(site));

    if (isDistraction) {
      // If it is, send a notification!
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon30.png',
        title: 'A Wild Distraction Appeared!',
        message: "Hey! Didn't you say you had a goal? Just a friendly nudge! 😉"
      });
    }
  }
});