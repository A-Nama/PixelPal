// A default list of distracting websites.
// We'll store the user's list in chrome.storage later.
const DEFAULT_DISTRACTION_SITES = [
  "twitter.com",
  "facebook.com",
  "instagram.com",
  "youtube.com",
  "reddit.com",
  "tiktok.com",
  "pinterest.com"
];

// This function creates the right-click "Vibe Check" menu item.
chrome.runtime.onInstalled.addListener(() => {
  // Set default values on installation
  chrome.storage.local.set({
    blockedSites: DEFAULT_DISTRACTION_SITES,
    focusState: 'chill' // Start in 'chill' mode
  });

  chrome.contextMenus.create({
    id: "vibeCheck",
    title: "Check the vibe with PixelPal ✨",
    contexts: ["selection"]
  });
});

// Listener for the "Vibe Check"
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "vibeCheck" && info.selectionText) {
    console.log("Selected text for vibe check:", info.selectionText);
    // This is where Teammate B's API call will be triggered.
  }
});

// This function listens for updates to any tab.
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // We only care when the URL changes.
  if (changeInfo.url) {
    // Get the current state from storage
    chrome.storage.local.get(['focusState', 'palName', 'blockedSites'], (data) => {
      // ONLY check for distractions if the user is in 'focus' mode.
      if (data.focusState === 'focus') {
        const isDistraction = data.blockedSites.some(site => changeInfo.url.includes(site));

        if (isDistraction) {
          const palName = data.palName || "PixelPal"; // Use default name if not set
          // If it is, send a notification!
          chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icons/avatar-sad.png', 
            title: 'Hey! A little distracted?',
            message: `${palName} says: Girl, looks like you're getting distracted. Let's lock in!`
          });
        }
      }
    });
  }
});